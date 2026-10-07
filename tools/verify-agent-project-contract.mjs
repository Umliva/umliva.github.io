#!/usr/bin/env node
/**
 * tools/verify-agent-project-contract.mjs
 *
 * Deterministic, offline, zero-dependency validator for the project-local agent
 * contract of this repository (config/agent-project-contract.json).
 *
 * Schema and stable reason codes: docs/AGENT_PROJECT_CONTRACT_SCHEMA.md
 *
 * Usage:
 *   node tools/verify-agent-project-contract.mjs [options]
 *
 * Options:
 *   --root <dir>       root directory to validate (default: the repository root
 *                      that contains this script, i.e. tools/..)
 *   --contract <path>  contract file, relative to the root or absolute inside it
 *                      (default: config/agent-project-contract.json)
 *   --target <path>    prospective write target to check (repeatable)
 *   --binding <path>   binding state file (host/temp scope; never committed)
 *   --bind             record/refresh the binding for the current root
 *   --show-paths       print absolute paths (hidden by default)
 *   --json             machine-readable single-object output
 *   --help             usage
 *
 * Exit codes: 0 = OK, 1 = contract violation (reason code on stdout),
 *             2 = usage error (message on stderr).
 *
 * This validator is a check, not a write interceptor. See the enforcement
 * classification in AGENTS.md.
 */
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const OK = 'OK';
const REASON_CODES = [
  'OK',
  'FAIL_WRONG_ROOT',
  'FAIL_REMOTE_MISMATCH',
  'FAIL_PROJECT_ID_MISMATCH',
  'FAIL_MISSING_CONTRACT',
  'FAIL_CONTRACT_SCHEMA',
  'FAIL_SYMLINK_ESCAPE',
  'FAIL_NESTED_PROJECT_ROOT',
  'FAIL_CONFIGURATION_SHADOWING',
  'FAIL_REBIND_REQUIRED',
  'FAIL_REMOTE_UNRESOLVED',
  'FAIL_WRITE_TARGET_DENIED',
  'FAIL_CROSS_PROJECT_SKILL_LEAKAGE',
];
// Deterministic failure precedence: the first check in this order that reports a
// violation determines the reported reason code.
const CHECK_ORDER = [
  'root-resolution',
  'contract-presence',
  'contract-schema',
  'root-markers',
  'path-map',
  'root-layout',
  'remote-resolution',
  'remote-identity',
  'project-id',
  'rebind',
  'write-target',
  'nested-project-root',
  'configuration-shadowing',
  'skill-isolation',
];
const REQUIRED_FIELDS = [
  'contractVersion',
  'contractId',
  'projectId',
  'projectName',
  'canonicalRemote',
  'defaultBranch',
  'hostLocalScope',
  'rootMarkers',
  'pathMap',
  'mutationBoundaries',
  'instructionAuthority',
  'skillIsolation',
  'declaredBoundaries',
  'discovery',
  'enforcement',
];
const ENFORCEMENT_VALUES = [
  'DOCUMENT_ONLY',
  'VALIDATOR_AVAILABLE',
  'HOOK_ENFORCED',
  'BROKER_ENFORCED',
  'TOOL_GAP',
];
const PATH_ROLES = [
  'siteRoot',
  'contract',
  'schemaDoc',
  'validator',
  'fixtureRunner',
  'fixtures',
  'hostAudit',
  'evidenceDir',
  'publishedPage',
  'publishedPageOptional',
  'verifierScript',
  'verifierScriptOptional',
  'contentDir',
];
const LAYOUTS = ['primary', 'linked-worktree', 'gitfile'];
const DEFAULT_CONTRACT = 'config/agent-project-contract.json';

/* ------------------------------------------------------------------ helpers */

const scriptDir = dirname(fileURLToPath(import.meta.url));
const defaultRoot = resolve(scriptDir, '..');

function usage(message, exitCode = 2) {
  if (message) process.stderr.write(`usage error: ${message}\n`);
  process.stderr.write(
    'usage: node tools/verify-agent-project-contract.mjs [--root <dir>] [--contract <path>]\n' +
      '       [--target <path>]... [--binding <path>] [--bind] [--show-paths] [--json] [--help]\n'
  );
  process.exit(exitCode);
}

function parseArgs(argv) {
  const options = {
    root: defaultRoot,
    contract: null,
    targets: [],
    binding: null,
    bind: false,
    showPaths: false,
    json: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) usage(`missing value for ${arg}`);
      i += 1;
      return value;
    };
    if (arg === '--root') options.root = next();
    else if (arg === '--contract') options.contract = next();
    else if (arg === '--target') options.targets.push(next());
    else if (arg === '--binding') options.binding = next();
    else if (arg === '--bind') options.bind = true;
    else if (arg === '--show-paths') options.showPaths = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--help' || arg === '-h') usage(undefined, 0);
    else usage(`unknown argument ${arg}`);
  }
  if (options.bind && !options.binding) usage('--bind requires --binding <path>');
  return options;
}

function toPosix(value) {
  return value.split(sep).join('/');
}

function relPath(root, absPath) {
  const rel = toPosix(relative(root, absPath));
  return rel === '' ? '.' : rel;
}

function safeLstat(path) {
  try {
    return lstatSync(path);
  } catch {
    return null;
  }
}

function safeRealpath(path) {
  try {
    return realpathSync(path);
  } catch {
    return null;
  }
}

function isRelativeSafePath(value) {
  if (typeof value !== 'string' || value.length === 0) return false;
  if (isAbsolute(value) || value.includes('\\') || value.includes('\0')) return false;
  if (value === '.') return true;
  const segments = value.split('/');
  return segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..');
}

function pathIsUnder(relOrAbs, prefix) {
  if (relOrAbs === prefix) return true;
  return relOrAbs.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`);
}

function sortedDirectoryEntries(dir) {
  return readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  );
}

function readTextFile(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

function readJsonFile(path) {
  const text = readTextFile(path);
  if (text === null) return { ok: false, value: null, error: 'unreadable' };
  try {
    return { ok: true, value: JSON.parse(text), error: null };
  } catch (error) {
    return { ok: false, value: null, error: `unparseable JSON (${error.message})` };
  }
}

/* --------------------------------------------------------- remote identity */

/**
 * Normalize a git remote URL to the identity `host/path` so that equivalent
 * HTTPS and SSH forms compare equal. Documented order: drop scheme, drop user
 * info, lowercase host, strip trailing slashes, strip a `.git` suffix, keep the
 * path case.
 */
function normalizeRemoteIdentity(raw) {
  if (typeof raw !== 'string') return null;
  let value = raw.trim();
  if (value === '') return null;
  let host;
  let repoPath;
  const scheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.exec(value);
  if (scheme) {
    const rest = value.slice(scheme[0].length);
    const slash = rest.indexOf('/');
    if (slash === -1) return null;
    host = rest.slice(0, slash);
    repoPath = rest.slice(slash + 1);
  } else {
    const colon = value.indexOf(':');
    if (colon === -1) return null;
    host = value.slice(0, colon);
    if (host.includes('/')) return null;
    repoPath = value.slice(colon + 1);
  }
  const at = host.lastIndexOf('@');
  if (at !== -1) host = host.slice(at + 1);
  host = host.toLowerCase();
  if (host === '') return null;
  repoPath = repoPath.replace(/^\/+/, '').replace(/\/+$/, '');
  repoPath = repoPath.replace(/\.git$/i, '').replace(/\/+$/, '');
  if (repoPath === '') return null;
  return `${host}/${repoPath}`;
}

function readRemoteUrl(configPath, remoteName) {
  const text = readTextFile(configPath);
  if (text === null) return null;
  let inSection = false;
  let url = null;
  for (const line of text.split(/\r?\n/)) {
    const section = /^\s*\[([^\]]+)\]\s*$/.exec(line);
    if (section) {
      inSection = section[1].trim().toLowerCase() === `remote "${remoteName.toLowerCase()}"`;
      continue;
    }
    if (!inSection) continue;
    const entry = /^\s*url\s*=\s*(.+?)\s*$/.exec(line);
    if (entry && url === null) url = entry[1];
  }
  return url;
}

/**
 * Resolve git metadata of a candidate root without invoking git.
 * Layouts: primary (`.git` directory), linked-worktree (`.git` gitfile plus
 * `commondir`), gitfile (`.git` gitfile pointing at a separate git dir).
 */
function resolveGitMetadata(root) {
  const meta = { layout: 'absent', gitDir: null, commonDir: null, configPath: null, remoteUrl: null };
  const dotGit = join(root, '.git');
  const info = safeLstat(dotGit);
  if (!info) return meta;
  if (info.isDirectory()) {
    meta.layout = 'primary';
    meta.gitDir = safeRealpath(dotGit) || dotGit;
    meta.commonDir = meta.gitDir;
  } else if (info.isFile()) {
    const text = readTextFile(dotGit) || '';
    const match = /^gitdir:\s*(.+)$/m.exec(text);
    if (!match) return meta;
    const rawGitDir = match[1].trim();
    const gitDirPath = isAbsolute(rawGitDir) ? rawGitDir : resolve(root, rawGitDir);
    if (!existsSync(gitDirPath)) return meta;
    meta.gitDir = safeRealpath(gitDirPath) || gitDirPath;
    const commonDirFile = join(meta.gitDir, 'commondir');
    if (existsSync(commonDirFile)) {
      const common = (readTextFile(commonDirFile) || '').trim();
      meta.commonDir = common ? safeRealpath(resolve(meta.gitDir, common)) : meta.gitDir;
      meta.layout = 'linked-worktree';
    } else {
      meta.commonDir = meta.gitDir;
      meta.layout = 'gitfile';
    }
  } else {
    return meta;
  }
  const configPath = join(meta.commonDir, 'config');
  if (existsSync(configPath)) {
    meta.configPath = configPath;
    meta.remoteUrl = readRemoteUrl(configPath, 'origin');
  }
  return meta;
}

/* ------------------------------------------------------------ write targets */

/**
 * Resolve a prospective write destination inside the real root. The path is
 * walked segment by segment *without* pre-normalizing `..`, so `..` after a
 * symlink moves out of the resolved target instead of being folded away
 * textually. Not-yet-existing segments stop the walk: the deepest existing
 * ancestor is realpath-resolved and the remaining segments are appended.
 */
function resolveContainment(realRoot, rawTarget, depth) {
  const raw = isAbsolute(rawTarget) ? rawTarget : `${realRoot}${sep}${rawTarget}`;
  const segments = raw.split(sep).filter((segment) => segment !== '' && segment !== '.');
  let current = isAbsolute(raw) ? sep : realRoot;
  let pending = [];
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    if (segment === '..') {
      current = dirname(current);
      continue;
    }
    const candidate = join(current, segment);
    const info = safeLstat(candidate);
    if (!info) {
      pending = segments.slice(i);
      break;
    }
    if (info.isSymbolicLink()) {
      let linkText = null;
      try {
        linkText = readlinkSync(candidate);
      } catch {
        linkText = null;
      }
      if (linkText === null) {
        pending = segments.slice(i);
        break;
      }
      if (depth > 20) return { escaped: true, path: candidate };
      const destination = isAbsolute(linkText) ? linkText : join(dirname(candidate), linkText);
      const inner = resolveContainment(realRoot, destination, depth + 1);
      if (inner.escaped) return { escaped: true, path: inner.path };
      current = inner.path;
      continue;
    }
    current = candidate;
  }
  const finalPath = pending.length > 0 ? join(current, ...pending) : current;
  const rel = relative(realRoot, finalPath);
  if (rel !== '' && (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel))) {
    return { escaped: true, path: finalPath };
  }
  return { escaped: false, path: finalPath };
}

function checkWriteTarget(realRoot, contract, targetArgument) {
  // The raw target string is passed through: pre-normalizing `..` textually
  // would hide a traversal that runs through a symlink.
  const removedPath = isAbsolute(targetArgument) ? targetArgument : `${realRoot}${sep}${targetArgument}`;
  const resolvedTarget = resolveContainment(realRoot, removedPath, 0);
  const shown = isAbsolute(targetArgument) ? '<absolute target>' : targetArgument;
  if (resolvedTarget.escaped) {
    return {
      check: 'write-target',
      code: 'FAIL_SYMLINK_ESCAPE',
      detail: `write target ${shown} resolves outside the project root (symlink, traversal or unresolved-parent chain)`,
    };
  }
  const relFinal = relPath(realRoot, resolvedTarget.path);
  const denied = (contract.mutationBoundaries?.deniedPrefixes || []).filter((prefix) =>
    pathIsUnder(relFinal, prefix)
  );
  if (denied.length > 0) {
    return {
      check: 'write-target',
      code: 'FAIL_WRITE_TARGET_DENIED',
      detail: `write target ${shown} resolves to ${relFinal}, which is a denied prefix (${denied.join(', ')})`,
    };
  }
  return null;
}

/* ------------------------------------------------------------ schema checks */

function validateContractSchema(contract, contractRelPath) {
  const problems = [];
  if (typeof contract !== 'object' || contract === null || Array.isArray(contract)) {
    return ['contract must be a JSON object'];
  }
  for (const field of REQUIRED_FIELDS) {
    if (!(field in contract)) problems.push(`missing required field ${field}`);
  }
  if (typeof contract.contractVersion !== 'string' || !/^\d+\.\d+\.\d+$/.test(contract.contractVersion)) {
    problems.push('contractVersion must be a MAJOR.MINOR.PATCH string');
  }
  if (typeof contract.contractId !== 'string' || contract.contractId.trim() === '') {
    problems.push('contractId must be a non-empty string');
  }
  if (typeof contract.projectId !== 'string' || !/^[A-Za-z0-9._-]+$/.test(contract.projectId)) {
    problems.push('projectId must be a non-empty string of [A-Za-z0-9._-]');
  }
  if (typeof contract.projectName !== 'string' || contract.projectName.trim() === '') {
    problems.push('projectName must be a non-empty string');
  }
  if (typeof contract.defaultBranch !== 'string' || contract.defaultBranch.trim() === '') {
    problems.push('defaultBranch must be a non-empty string');
  }

  const remote = contract.canonicalRemote;
  if (typeof remote !== 'object' || remote === null || Array.isArray(remote)) {
    problems.push('canonicalRemote must be an object');
  } else {
    const canonical = normalizeRemoteIdentity(remote.url);
    if (canonical === null) problems.push('canonicalRemote.url must be a git remote URL');
    if (remote.normalizedIdentity !== canonical) {
      problems.push('canonicalRemote.normalizedIdentity must equal the normalized form of canonicalRemote.url');
    }
    if (!Array.isArray(remote.acceptedForms) || remote.acceptedForms.length === 0) {
      problems.push('canonicalRemote.acceptedForms must be a non-empty array');
    } else {
      for (const form of remote.acceptedForms) {
        if (normalizeRemoteIdentity(form) !== canonical) {
          problems.push(`canonicalRemote.acceptedForms entry ${JSON.stringify(form)} does not normalize to ${canonical}`);
        }
      }
    }
    if (!Array.isArray(remote.approvedForkIdentities)) {
      problems.push('canonicalRemote.approvedForkIdentities must be an array');
    }
    const normalization = remote.normalization;
    if (typeof normalization !== 'object' || normalization === null) {
      problems.push('canonicalRemote.normalization must be an object');
    } else {
      for (const key of [
        'dropScheme',
        'dropUserInfo',
        'lowercaseHost',
        'stripGitSuffix',
        'stripTrailingSlash',
        'preservePathCase',
      ]) {
        if (typeof normalization[key] !== 'boolean') {
          problems.push(`canonicalRemote.normalization.${key} must be a boolean`);
        }
      }
    }
  }

  const hostScope = contract.hostLocalScope;
  if (typeof hostScope !== 'object' || hostScope === null) {
    problems.push('hostLocalScope must be an object');
  } else {
    if (hostScope.location !== 'host-local') problems.push('hostLocalScope.location must be "host-local"');
    if (!Array.isArray(hostScope.committedPaths) || hostScope.committedPaths.length !== 0) {
      problems.push('hostLocalScope.committedPaths must be an empty array (no host paths may be committed)');
    }
  }

  const markers = contract.rootMarkers;
  if (!Array.isArray(markers) || markers.length === 0) {
    problems.push('rootMarkers must be a non-empty array');
  } else {
    for (const marker of markers) {
      if (typeof marker !== 'object' || marker === null) {
        problems.push('rootMarkers entries must be objects');
        continue;
      }
      if (!isRelativeSafePath(marker.path)) problems.push(`rootMarkers path ${JSON.stringify(marker.path)} must be repo-relative`);
      if (marker.kind !== 'file' && marker.kind !== 'dir') problems.push(`rootMarkers kind must be "file" or "dir"`);
      if (typeof marker.required !== 'boolean') problems.push('rootMarkers required must be a boolean');
    }
  }

  const pathMap = contract.pathMap;
  if (!Array.isArray(pathMap) || pathMap.length === 0) {
    problems.push('pathMap must be a non-empty array');
  } else {
    for (const entry of pathMap) {
      if (typeof entry !== 'object' || entry === null) {
        problems.push('pathMap entries must be objects');
        continue;
      }
      if (!PATH_ROLES.includes(entry.role)) problems.push(`pathMap role ${JSON.stringify(entry.role)} is not a documented role`);
      if (!isRelativeSafePath(entry.path)) problems.push(`pathMap path ${JSON.stringify(entry.path)} must be repo-relative`);
      if (entry.kind !== 'file' && entry.kind !== 'dir') problems.push('pathMap kind must be "file" or "dir"');
      if (typeof entry.required !== 'boolean') problems.push('pathMap required must be a boolean');
      if (entry.role === 'contract' && entry.path !== contractRelPath) {
        problems.push(`pathMap contract path ${JSON.stringify(entry.path)} differs from the validated contract path ${JSON.stringify(contractRelPath)}`);
      }
    }
    if (!pathMap.some((entry) => entry.role === 'siteRoot')) problems.push('pathMap must declare a siteRoot entry');
  }

  const boundaries = contract.mutationBoundaries;
  if (typeof boundaries !== 'object' || boundaries === null) {
    problems.push('mutationBoundaries must be an object');
  } else {
    if (typeof boundaries.rootIsWriteBoundary !== 'boolean') problems.push('mutationBoundaries.rootIsWriteBoundary must be a boolean');
    if (!['DENY', 'ALLOW_DECLARED'].includes(boundaries.outsideRootPolicy)) {
      problems.push('mutationBoundaries.outsideRootPolicy must be "DENY" or "ALLOW_DECLARED"');
    }
    if (boundaries.symlinkTraversalPolicy !== 'DENY') {
      problems.push('mutationBoundaries.symlinkTraversalPolicy must be "DENY"');
    }
    if (boundaries.navigationGrantsWrite !== false) {
      problems.push('mutationBoundaries.navigationGrantsWrite must be false');
    }
    if (!Array.isArray(boundaries.deniedPrefixes) || !boundaries.deniedPrefixes.every(isRelativeSafePath)) {
      problems.push('mutationBoundaries.deniedPrefixes must be an array of repo-relative paths');
    }
  }

  const authority = contract.instructionAuthority;
  if (typeof authority !== 'object' || authority === null) {
    problems.push('instructionAuthority must be an object');
  } else {
    if (authority.claimsToOverrideHigherPriorityInstructions !== false) {
      problems.push('instructionAuthority.claimsToOverrideHigherPriorityInstructions must be false');
    }
    if (authority.nestedInstructionPolicy !== 'identity-redeclaration-forbidden') {
      problems.push('instructionAuthority.nestedInstructionPolicy must be "identity-redeclaration-forbidden"');
    }
    if (!Array.isArray(authority.shadowingFileNames) || authority.shadowingFileNames.length === 0) {
      problems.push('instructionAuthority.shadowingFileNames must be a non-empty array');
    }
  }

  const skills = contract.skillIsolation;
  if (typeof skills !== 'object' || skills === null) {
    problems.push('skillIsolation must be an object');
  } else {
    if (skills.policy !== 'NO_CROSS_PROJECT_SKILL_LEAKAGE') {
      problems.push('skillIsolation.policy must be "NO_CROSS_PROJECT_SKILL_LEAKAGE"');
    }
    if (!Array.isArray(skills.repoSkillRoots) || !skills.repoSkillRoots.every(isRelativeSafePath)) {
      problems.push('skillIsolation.repoSkillRoots must be an array of repo-relative paths');
    }
    if (!Array.isArray(skills.instructionFileNames) || skills.instructionFileNames.length === 0) {
      problems.push('skillIsolation.instructionFileNames must be a non-empty array');
    }
    if (!Array.isArray(skills.foreignProjectMarkers)) {
      problems.push('skillIsolation.foreignProjectMarkers must be an array');
    }
    if (!ENFORCEMENT_VALUES.includes(skills.activationVerification)) {
      problems.push('skillIsolation.activationVerification must be an enforcement classification value');
    }
    const globalScope = skills.globalScope;
    if (typeof globalScope !== 'object' || globalScope === null) {
      problems.push('skillIsolation.globalScope must be an object');
    } else {
      if (globalScope.location !== 'host-local') problems.push('skillIsolation.globalScope.location must be "host-local"');
      if (!Array.isArray(globalScope.committedPaths) || globalScope.committedPaths.length !== 0) {
        problems.push('skillIsolation.globalScope.committedPaths must be an empty array (no host paths may be committed)');
      }
    }
  }

  const declared = contract.declaredBoundaries;
  if (typeof declared !== 'object' || declared === null) {
    problems.push('declaredBoundaries must be an object');
  } else {
    for (const key of ['modulesAllowlist', 'vendoredExamples']) {
      if (!Array.isArray(declared[key]) || !declared[key].every(isRelativeSafePath)) {
        problems.push(`declaredBoundaries.${key} must be an array of repo-relative paths`);
      }
    }
    if (!Array.isArray(declared.submodules)) {
      problems.push('declaredBoundaries.submodules must be an array');
    } else {
      for (const entry of declared.submodules) {
        if (typeof entry !== 'object' || entry === null || !isRelativeSafePath(entry.path)) {
          problems.push('declaredBoundaries.submodules entries must be objects with a repo-relative path');
        } else if (typeof entry.required !== 'boolean') {
          problems.push('declaredBoundaries.submodules entries need a boolean required flag');
        }
      }
    }
    const worktrees = declared.worktrees;
    if (typeof worktrees !== 'object' || worktrees === null) {
      problems.push('declaredBoundaries.worktrees must be an object');
    } else {
      if (!Array.isArray(worktrees.allowedLayouts) || !worktrees.allowedLayouts.every((l) => LAYOUTS.includes(l))) {
        problems.push(`declaredBoundaries.worktrees.allowedLayouts must be a subset of ${LAYOUTS.join(', ')}`);
      }
      if (worktrees.nestedInsideRoot !== 'FORBIDDEN') {
        problems.push('declaredBoundaries.worktrees.nestedInsideRoot must be "FORBIDDEN"');
      }
      if (worktrees.registration !== 'host-local-only') {
        problems.push('declaredBoundaries.worktrees.registration must be "host-local-only"');
      }
    }
  }

  const discovery = contract.discovery;
  if (typeof discovery !== 'object' || discovery === null) {
    problems.push('discovery must be an object');
  } else if (!Array.isArray(discovery.exclusions)) {
    problems.push('discovery.exclusions must be an array');
  } else {
    for (const entry of discovery.exclusions) {
      if (typeof entry !== 'object' || entry === null || !isRelativeSafePath(entry.path)) {
        problems.push('discovery.exclusions entries must be objects with a repo-relative path');
      } else if (entry.path === '.') {
        problems.push('discovery.exclusions must not exclude the project root itself');
      } else if (typeof entry.reason !== 'string' || entry.reason.trim() === '') {
        problems.push('discovery.exclusions entries need a non-empty reason');
      }
    }
  }

  const enforcement = contract.enforcement;
  if (typeof enforcement !== 'object' || enforcement === null) {
    problems.push('enforcement must be an object');
  } else {
    const classification = enforcement.classification;
    if (typeof classification !== 'object' || classification === null || Array.isArray(classification)) {
      problems.push('enforcement.classification must be an object');
    } else if (Object.keys(classification).length === 0) {
      problems.push('enforcement.classification must not be empty');
    } else {
      for (const [key, value] of Object.entries(classification)) {
        if (!ENFORCEMENT_VALUES.includes(value)) {
          problems.push(`enforcement.classification.${key} must be one of ${ENFORCEMENT_VALUES.join(', ')}`);
        }
      }
    }
    const semantics = enforcement.hostAuditSemantics;
    if (typeof semantics !== 'object' || semantics === null) {
      problems.push('enforcement.hostAuditSemantics must be an object');
    } else {
      const values = semantics.values;
      if (!Array.isArray(values) || values.join(',') !== 'PASS,FAIL,NOT_VERIFIED') {
        problems.push('enforcement.hostAuditSemantics.values must be exactly PASS, FAIL, NOT_VERIFIED');
      }
      if (semantics.unavailableHost !== 'NOT_VERIFIED') {
        problems.push('enforcement.hostAuditSemantics.unavailableHost must be "NOT_VERIFIED"');
      }
      if (semantics.ciHostInspection !== 'NOT_POSSIBLE') {
        problems.push('enforcement.hostAuditSemantics.ciHostInspection must be "NOT_POSSIBLE"');
      }
    }
  }
  return problems;
}

function validateSchemaDoc(docPath) {
  const problems = [];
  const text = readTextFile(docPath);
  if (text === null) return ['schema document is unreadable'];
  for (const code of REASON_CODES) {
    if (!text.includes(code)) problems.push(`schema document does not document reason code ${code}`);
  }
  for (const field of REQUIRED_FIELDS) {
    if (!text.includes(`\`${field}\``)) problems.push(`schema document does not document required field ${field}`);
  }
  return problems;
}

/* --------------------------------------------------------------- discovery */

function walkTree(realRoot, exclusions) {
  const directories = [];
  const files = [];
  const stack = [realRoot];
  while (stack.length > 0) {
    const dir = stack.pop();
    let entries;
    try {
      entries = sortedDirectoryEntries(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const abs = join(dir, entry.name);
      const rel = relPath(realRoot, abs);
      if (entry.name === '.git') continue;
      if (exclusions.some((excluded) => pathIsUnder(rel, excluded))) continue;
      if (entry.isDirectory()) {
        directories.push({ abs, rel });
        stack.push(abs);
      } else if (entry.isFile() || entry.isSymbolicLink()) {
        files.push({ abs, rel, name: entry.name });
      }
    }
  }
  directories.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
  files.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
  return { directories, files };
}

function scanProjectIntegrity({ realRoot, contract, rootProjectId, contractRelPath, exclusions }) {
  const violations = [];
  const { directories, files } = walkTree(realRoot, exclusions);
  const modules = contract.declaredBoundaries?.modulesAllowlist || [];
  const vendored = contract.declaredBoundaries?.vendoredExamples || [];
  const submodules = (contract.declaredBoundaries?.submodules || []).map((entry) => entry.path);
  const contractBasename = contractRelPath.split('/').pop();
  const undeclared = new Set();

  for (const dir of directories) {
    if ([...undeclared].some((prefix) => pathIsUnder(dir.rel, prefix))) continue;
    const evidence = [];
    const dotGit = join(dir.abs, '.git');
    const gitInfo = safeLstat(dotGit);
    if (gitInfo) evidence.push(gitInfo.isFile() ? 'gitlink' : 'git-directory');
    const nestedContractPath = join(dir.abs, ...contractRelPath.split('/'));
    if (existsSync(nestedContractPath)) evidence.push('contract-file');
    if (evidence.length === 0) continue;

    const declaredAsSubmodule = submodules.some((prefix) => pathIsUnder(dir.rel, prefix));
    const declaredAsModule = modules.some((prefix) => pathIsUnder(dir.rel, prefix));
    const declaredAsVendored = vendored.some((prefix) => pathIsUnder(dir.rel, prefix));

    if (evidence.includes('contract-file')) {
      const nested = readJsonFile(nestedContractPath);
      const nestedProjectId = nested.ok ? nested.value?.projectId : null;
      const sameProject = nestedProjectId !== null && nestedProjectId === rootProjectId;
      if (sameProject) {
        violations.push({
          check: 'nested-project-root',
          code: 'FAIL_NESTED_PROJECT_ROOT',
          detail: `${dir.rel} contains a contract for the same projectId ${rootProjectId}; a second copy of this project inside itself is forbidden even when declared`,
        });
      } else if (!(declaredAsSubmodule || declaredAsModule || declaredAsVendored)) {
        violations.push({
          check: 'nested-project-root',
          code: 'FAIL_NESTED_PROJECT_ROOT',
          detail: `${dir.rel} contains a project contract (${nested.ok ? `projectId ${JSON.stringify(nestedProjectId)}` : nested.error}) but is not declared in declaredBoundaries`,
        });
      }
    }
    if (evidence.includes('git-directory')) {
      violations.push({
        check: 'nested-project-root',
        code: 'FAIL_NESTED_PROJECT_ROOT',
        detail: `${dir.rel} contains a nested git repository (.git directory); declarations do not license a nested clone${declaredAsSubmodule ? ` (${dir.rel} is declared as a submodule, which must use a .git gitlink file)` : ''}`,
      });
    } else if (evidence.includes('gitlink') && !declaredAsSubmodule) {
      violations.push({
        check: 'nested-project-root',
        code: 'FAIL_NESTED_PROJECT_ROOT',
        detail: `${dir.rel} contains git metadata (.git gitlink) and is not declared as a submodule in declaredBoundaries`,
      });
    }
    undeclared.add(dir.rel);
  }

  const shadowingNames = new Set(contract.instructionAuthority?.shadowingFileNames || []);
  const instructionNames = new Set(contract.skillIsolation?.instructionFileNames || []);
  const skillRoots = contract.skillIsolation?.repoSkillRoots || [];
  const markers = contract.skillIsolation?.foreignProjectMarkers || [];
  const identityNeedle = contract.canonicalRemote?.normalizedIdentity || '';

  for (const file of files) {
    const base = file.rel.split('/').pop();
    const underDeclaredBoundary = [...modules, ...vendored, ...submodules].some((prefix) =>
      pathIsUnder(file.rel, prefix)
    );
    if (shadowingNames.has(base)) {
      violations.push({
        check: 'configuration-shadowing',
        code: 'FAIL_CONFIGURATION_SHADOWING',
        detail: `${file.rel} is a declared shadowing instruction file; project authority must stay in ${contract.instructionAuthority?.projectInstructionFile}`,
      });
    } else if (base === contractBasename && file.rel !== contractRelPath && !underDeclaredBoundary) {
      violations.push({
        check: 'configuration-shadowing',
        code: 'FAIL_CONFIGURATION_SHADOWING',
        detail: `${file.rel} duplicates the contract configuration at a non-canonical path; a second configuration authority is forbidden`,
      });
    }
    const instructionFileName = contract.instructionAuthority?.projectInstructionFile;
    if (base === instructionFileName && file.rel !== instructionFileName) {
      const text = readTextFile(file.abs) || '';
      const declaresIdentity = /canonicalRemote|projectId|canonical repository/i.test(text);
      const namesIdentity = identityNeedle !== '' && text.includes(identityNeedle);
      if (declaresIdentity && namesIdentity) {
        violations.push({
          check: 'configuration-shadowing',
          code: 'FAIL_CONFIGURATION_SHADOWING',
          detail: `${file.rel} re-declares the project identity of the root contract; nested instruction files must not redeclare identity`,
        });
      }
    }
    const inSkillRoot = skillRoots.some((prefix) => pathIsUnder(file.rel, prefix));
    if (instructionNames.has(base) || (inSkillRoot && base === 'SKILL.md')) {
      const text = readTextFile(file.abs);
      if (text === null) continue;
      const hits = markers.filter((marker) => text.includes(marker));
      if (hits.length > 0 && !underDeclaredBoundary) {
        violations.push({
          check: 'skill-isolation',
          code: 'FAIL_CROSS_PROJECT_SKILL_LEAKAGE',
          detail: `${file.rel} carries foreign project identity markers (${hits.length} match(es)); cross-project instruction or skill content must not be committed here`,
        });
      }
    }
  }
  return violations;
}

/* ------------------------------------------------------------------- output */

function pickPrimary(violations) {
  if (violations.length === 0) return null;
  return violations
    .slice()
    .sort((a, b) => CHECK_ORDER.indexOf(a.check) - CHECK_ORDER.indexOf(b.check))[0];
}

function summarize(contract) {
  return {
    contractVersion: contract?.contractVersion ?? null,
    contractId: contract?.contractId ?? null,
    projectId: contract?.projectId ?? null,
    normalizedIdentity: contract?.canonicalRemote?.normalizedIdentity ?? null,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const violations = [];
  const checksRun = new Set();
  let bindingState = 'not-checked';
  const run = (check, fn) => {
    checksRun.add(check);
    const result = fn();
    for (const violation of result || []) violations.push(violation);
  };

  const rootInfo = safeLstat(options.root);
  checksRun.add('root-resolution');
  if (!rootInfo || !rootInfo.isDirectory()) {
    violations.push({
      check: 'root-resolution',
      code: 'FAIL_WRONG_ROOT',
      detail: 'root directory does not exist or is not a directory',
    });
  }
  const realRoot = rootInfo && rootInfo.isDirectory() ? safeRealpath(options.root) || resolve(options.root) : null;

  let contract = null;
  let contractRelPath = options.contract || DEFAULT_CONTRACT;
  let contractAbs = null;
  let contractHash = null;

  if (realRoot) {
    if (isAbsolute(contractRelPath)) {
      const rel = relative(realRoot, contractRelPath);
      if (rel === '' || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
        usage('--contract must point inside the validated root');
      }
      contractRelPath = toPosix(rel);
    }
    contractAbs = join(realRoot, ...contractRelPath.split('/'));
    run('contract-presence', () => {
      if (!existsSync(contractAbs)) {
        return [{ check: 'contract-presence', code: 'FAIL_MISSING_CONTRACT', detail: `contract ${contractRelPath} is missing at the resolved root` }];
      }
      return [];
    });
  }

  if (contractAbs && existsSync(contractAbs)) {
    const parsed = readJsonFile(contractAbs);
    if (parsed.ok) contract = parsed.value;
    try {
      contractHash = createHash('sha256').update(readFileSync(contractAbs)).digest('hex');
    } catch {
      contractHash = null;
    }
    run('contract-schema', () => {
      if (!parsed.ok) {
        return [{ check: 'contract-schema', code: 'FAIL_CONTRACT_SCHEMA', detail: `${contractRelPath} ${parsed.error}` }];
      }
      const problems = validateContractSchema(contract, contractRelPath);
      const docEntry = (contract.pathMap || []).find((entry) => entry.role === 'schemaDoc');
      if (docEntry && isRelativeSafePath(docEntry.path)) {
        const docAbs = join(realRoot, ...docEntry.path.split('/'));
        if (existsSync(docAbs)) problems.push(...validateSchemaDoc(docAbs));
        else if (docEntry.required) problems.push(`schema document ${docEntry.path} is missing`);
      }
      return problems.slice(0, 4).map((problem) => ({ check: 'contract-schema', code: 'FAIL_CONTRACT_SCHEMA', detail: problem }));
    });
  }

  let gitMeta = { layout: 'absent', remoteUrl: null, configPath: null };
  let normalizedRemote = null;
  let identityKind = null;

  if (contract && realRoot) {
    run('root-markers', () => {
      const problems = [];
      for (const marker of contract.rootMarkers || []) {
        if (marker.required !== true) continue;
        const abs = join(realRoot, ...marker.path.split('/'));
        const info = safeLstat(abs);
        if (!info) problems.push(`required root marker ${marker.path} is missing`);
        else if (marker.kind === 'file' && !(info.isFile() || info.isSymbolicLink())) problems.push(`root marker ${marker.path} is not a file`);
        else if (marker.kind === 'dir' && !info.isDirectory()) problems.push(`root marker ${marker.path} is not a directory`);
      }
      return problems
        .slice(0, 4)
        .map((detail) => ({ check: 'root-markers', code: 'FAIL_WRONG_ROOT', detail }));
    });

    run('path-map', () => {
      const problems = [];
      for (const entry of contract.pathMap || []) {
        if (entry.required !== true) continue;
        const abs = join(realRoot, ...entry.path.split('/'));
        const info = safeLstat(abs);
        if (!info) problems.push(`required ${entry.role} path ${entry.path} is missing`);
        else if (entry.kind === 'file' && !(info.isFile() || info.isSymbolicLink())) problems.push(`${entry.role} ${entry.path} is not a file`);
        else if (entry.kind === 'dir' && !info.isDirectory()) problems.push(`${entry.role} ${entry.path} is not a directory`);
      }
      return problems.slice(0, 4).map((detail) => ({ check: 'path-map', code: 'FAIL_WRONG_ROOT', detail }));
    });

    gitMeta = resolveGitMetadata(realRoot);

    run('root-layout', () => {
      if (gitMeta.layout === 'absent') return [];
      const allowed = contract.declaredBoundaries?.worktrees?.allowedLayouts || [];
      if (!allowed.includes(gitMeta.layout)) {
        return [
          {
            check: 'root-layout',
            code: 'FAIL_WRONG_ROOT',
            detail: `detected checkout layout ${gitMeta.layout} is not declared in declaredBoundaries.worktrees.allowedLayouts (${allowed.join(', ') || 'none'})`,
          },
        ];
      }
      return [];
    });

    run('remote-resolution', () => {
      if (gitMeta.layout === 'absent') {
        return [{ check: 'remote-resolution', code: 'FAIL_REMOTE_UNRESOLVED', detail: 'no git metadata at the resolved root; canonical remote identity is unverifiable' }];
      }
      if (gitMeta.layout === 'invalid-gitfile' || !gitMeta.remoteUrl) {
        return [{ check: 'remote-resolution', code: 'FAIL_REMOTE_UNRESOLVED', detail: 'git metadata present but no origin remote could be read' }];
      }
      normalizedRemote = normalizeRemoteIdentity(gitMeta.remoteUrl);
      if (normalizedRemote === null) {
        return [{ check: 'remote-resolution', code: 'FAIL_REMOTE_UNRESOLVED', detail: 'origin remote URL cannot be normalized to a repository identity' }];
      }
      return [];
    });

    run('remote-identity', () => {
      if (normalizedRemote === null) return [];
      const canonical = contract.canonicalRemote.normalizedIdentity;
      const forks = contract.canonicalRemote.approvedForkIdentities || [];
      if (normalizedRemote === canonical) {
        identityKind = 'canonical';
        return [];
      }
      if (forks.includes(normalizedRemote)) {
        identityKind = 'approved-fork';
        return [];
      }
      return [
        {
          check: 'remote-identity',
          code: 'FAIL_REMOTE_MISMATCH',
          detail: `origin identity ${normalizedRemote} is neither the canonical identity ${canonical} nor a declared approved fork`,
        },
      ];
    });

    run('project-id', () => {
      if (normalizedRemote === null) return [];
      const expected = normalizedRemote.split('/').pop();
      if (contract.projectId !== expected) {
        return [
          {
            check: 'project-id',
            code: 'FAIL_PROJECT_ID_MISMATCH',
            detail: `contract projectId ${JSON.stringify(contract.projectId)} does not match the repository identity ${JSON.stringify(expected)}`,
          },
        ];
      }
      return [];
    });

    run('rebind', () => {
      if (!options.binding) return [];
      const expectedBinding = {
        contractVersion: contract.contractVersion,
        projectId: contract.projectId,
        normalizedRemote,
        realRoot,
        contractHash,
      };
      let existing = null;
      if (existsSync(options.binding)) {
        const parsed = readJsonFile(options.binding);
        if (!parsed.ok) {
          return [{ check: 'rebind', code: 'FAIL_REBIND_REQUIRED', detail: 'binding state is unreadable; re-run with --bind to rebind the project context' }];
        }
        existing = parsed.value;
      }
      const differences = [];
      if (existing) {
        if (existing.projectId !== expectedBinding.projectId) differences.push('project identity changed');
        if (existing.normalizedRemote !== expectedBinding.normalizedRemote) differences.push('canonical remote identity changed');
        if (existing.realRoot !== expectedBinding.realRoot) differences.push('resolved root changed');
        if (existing.contractHash !== expectedBinding.contractHash) differences.push('contract content changed');
      }
      if (differences.length > 0 && !options.bind) {
        return [
          {
            check: 'rebind',
            code: 'FAIL_REBIND_REQUIRED',
            detail: `recorded write authority is invalid for this root (${differences.join('; ')}); reload the project rules and re-run with --bind to rebind`,
          },
        ];
      }
      if (options.bind) {
        if (violations.length > 0) {
          bindingState = 'refused';
        } else {
          if (!existing || differences.length > 0 || existing.contractVersion !== expectedBinding.contractVersion) {
            writeFileSync(options.binding, `${JSON.stringify(expectedBinding, null, 2)}\n`);
          }
          bindingState = differences.length > 0 ? 'rebound' : 'written';
        }
      } else {
        bindingState = existing ? 'valid' : 'absent';
      }
      return [];
    });

    run('write-target', () =>
      options.targets.map((target) => checkWriteTarget(realRoot, contract, target)).filter(Boolean)
    );

    const integrity = scanProjectIntegrity({
      realRoot,
      contract,
      rootProjectId: contract.projectId,
      contractRelPath,
      exclusions: (contract.discovery?.exclusions || []).map((entry) => entry.path),
    });
    for (const name of ['nested-project-root', 'configuration-shadowing', 'skill-isolation']) {
      checksRun.add(name);
    }
    for (const violation of integrity) violations.push(violation);
  }

  const primary = pickPrimary(violations);
  const reasonCode = primary ? primary.code : OK;
  const summary = summarize(contract);
  const base = {
    reasonCode,
    ok: !primary,
    ...summary,
    layout: gitMeta.layout,
    normalizedRemote,
    identityKind,
    checks: checksRun.size,
    binding: bindingState,
    ...(options.showPaths && realRoot ? { root: realRoot } : {}),
  };
  const payload = {
    ...base,
    violations: violations.map((violation) => ({ check: violation.check, code: violation.code, detail: violation.detail })),
  };

  if (options.json) {
    process.stdout.write(`${JSON.stringify(payload)}\n`);
  } else {
    if (primary) {
      process.stdout.write(`FAIL agent-project-contract reasonCode=${reasonCode} check=${primary.check}\n`);
      process.stdout.write(`detail=${primary.detail}\n`);
      const additional = violations.filter((violation) => violation !== primary);
      if (additional.length > 0) process.stdout.write(`additionalViolations=${additional.length}\n`);
      for (const violation of additional.slice(0, 4)) {
        process.stdout.write(`additional=${violation.code} ${violation.detail}\n`);
      }
    } else {
      const layout = base.layout === 'absent' ? 'unresolved' : base.layout;
      process.stdout.write(
        `PASS agent-project-contract reasonCode=OK checks=${base.checks} contractVersion=${summary.contractVersion} projectId=${summary.projectId} layout=${layout} identity=${identityKind} binding=${base.binding}\n`
      );
    }
  }
  process.exit(primary ? 1 : 0);
}

main();
