#!/usr/bin/env node
/**
 * tools/run-agent-project-contract-fixtures.mjs
 *
 * Runs every fixture case of tools/fixtures/agent-project-contract/ against
 * tools/verify-agent-project-contract.mjs and asserts the exact expected reason
 * code and exit code.
 *
 * Deterministic and idempotent: every case is materialized into a fresh
 * temporary directory (created at run time, so no broken symlink and no `.git`
 * directory is ever committed), the output contains no absolute paths, and all
 * temporary state is removed before exit.
 *
 * Fixture model: tools/fixtures/agent-project-contract/README.md
 * Schema and reason codes: docs/AGENT_PROJECT_CONTRACT_SCHEMA.md
 *
 * Runner-level reason codes: FAIL_FIXTURE_SETUP, FAIL_FIXTURE_MISMATCH.
 * Exit codes: 0 = all fixtures matched, 1 = mismatch, 2 = usage error.
 *
 * Usage: node tools/run-agent-project-contract-fixtures.mjs [--case <id>] [--fixtures-root <dir>]
 *
 * `--fixtures-root` points at an alternative fixtures root holding `base-tree/` and `cases/`; it
 * exists so the mismatch path of this runner can be exercised on a temporary synthetic fixtures
 * root without touching the committed fixtures.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const validatorPath = join(scriptDir, 'verify-agent-project-contract.mjs');
const defaultFixturesRoot = join(scriptDir, 'fixtures', 'agent-project-contract');
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

let selectedCase = null;
let fixturesRoot = defaultFixturesRoot;
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === '--case') {
    selectedCase = argv[i + 1];
    if (!selectedCase) {
      process.stderr.write('usage error: --case needs an id\n');
      process.exit(2);
    }
    i += 1;
  } else if (argv[i] === '--fixtures-root') {
    const value = argv[i + 1];
    if (!value) {
      process.stderr.write('usage error: --fixtures-root needs a directory\n');
      process.exit(2);
    }
    fixturesRoot = isAbsolute(value) ? value : resolve(process.cwd(), value);
    i += 1;
  } else {
    process.stderr.write(`usage error: unknown argument ${argv[i]}\n`);
    process.exit(2);
  }
}
const baseTreePath = join(fixturesRoot, 'base-tree');
const casesPath = join(fixturesRoot, 'cases');

/* --------------------------------------------------------------- safeguards */

class FixtureError extends Error {}

function sanitize(text, workspace) {
  return String(text).split(workspace).join('<workspace>').split('\n').join(' ');
}

function resolveInside(base, relPath, workspace) {
  if (typeof relPath !== 'string' || relPath === '' || isAbsolute(relPath) || relPath.includes('\0')) {
    throw new FixtureError(`fixture path ${JSON.stringify(relPath)} must be a relative path`);
  }
  const resolved = resolve(base, relPath);
  const rel = relative(base, resolved);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new FixtureError(`fixture path ${JSON.stringify(relPath)} escapes ${sanitize(base, workspace)}`);
  }
  return resolved;
}

function deepMerge(target, patch) {
  if (patch === null) return undefined;
  if (typeof patch !== 'object' || Array.isArray(patch)) return patch;
  const base = typeof target === 'object' && target !== null && !Array.isArray(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(patch)) {
    const merged = deepMerge(base[key], value);
    if (merged === undefined) delete base[key];
    else base[key] = merged;
  }
  return base;
}

function hashFile(path) {
  if (!existsSync(path)) return null;
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/* ------------------------------------------------------------ materializing */

function applyGit(treePath, workspace, treeName, git) {
  if (!git || git.layout === 'none' || !git.layout) return;
  const configBody = `[remote "origin"]\n\turl = ${git.url}\n`;
  if (git.layout === 'primary') {
    mkdirSync(join(treePath, '.git'), { recursive: true });
    writeFileSync(join(treePath, '.git', 'config'), configBody);
    return;
  }
  if (git.layout === 'linked-worktree') {
    const commonDir = join(workspace, 'common.git');
    const worktreeDir = join(commonDir, 'worktrees', treeName);
    mkdirSync(worktreeDir, { recursive: true });
    writeFileSync(join(worktreeDir, 'commondir'), '../..\n');
    writeFileSync(join(commonDir, 'config'), configBody);
    writeFileSync(join(treePath, '.git'), `gitdir: ../common.git/worktrees/${treeName}\n`);
    return;
  }
  throw new FixtureError(`unknown git layout ${git.layout}`);
}

function applySetup(treePath, workspace, setup) {
  for (const op of setup) {
    const at = op.at === 'workspace' ? workspace : treePath;
    if (op.op === 'mkdir') {
      mkdirSync(resolveInside(at, op.path, workspace), { recursive: true });
    } else if (op.op === 'write') {
      const target = resolveInside(at, op.path, workspace);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, op.content ?? '');
    } else if (op.op === 'copy') {
      const from = resolveInside(treePath, op.from, workspace);
      if (!existsSync(from)) throw new FixtureError(`copy source ${op.from} is missing`);
      const target = resolveInside(treePath, op.path, workspace);
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(from, target);
    } else if (op.op === 'symlink') {
      const linkPath = resolveInside(treePath, op.path, workspace);
      mkdirSync(dirname(linkPath), { recursive: true });
      symlinkSync(op.target, linkPath);
    } else if (op.op === 'remove') {
      rmSync(resolveInside(at, op.path, workspace), { recursive: true, force: true });
    } else if (op.op === 'patchJson') {
      const target = resolveInside(treePath, op.path, workspace);
      const current = JSON.parse(readFileSync(target, 'utf8'));
      const merged = deepMerge(current, op.set ?? {});
      writeFileSync(target, `${JSON.stringify(merged, null, 2)}\n`);
    } else {
      throw new FixtureError(`unknown setup op ${op.op}`);
    }
  }
}

function expandArgument(argument, context) {
  return argument.replace(/\{([A-Za-z0-9_]+)\}/g, (match, name) => {
    if (name === 'STATE') return context.statePath;
    if (Object.prototype.hasOwnProperty.call(context.trees, name)) return context.trees[name];
    throw new FixtureError(`unknown placeholder ${match}`);
  });
}

function validateManifest(manifest, file) {
  const expectedId = file.replace(/\.json$/, '');
  if (manifest.id !== expectedId) throw new FixtureError(`id ${manifest.id} does not match file name ${file}`);
  if (typeof manifest.description !== 'string' || manifest.description.trim() === '') {
    throw new FixtureError('description is required');
  }
  if (typeof manifest.trees !== 'object' || manifest.trees === null || Object.keys(manifest.trees).length === 0) {
    throw new FixtureError('trees must be a non-empty object');
  }
  if (!Array.isArray(manifest.steps) || manifest.steps.length === 0) {
    throw new FixtureError('steps must be a non-empty array');
  }
  for (const step of manifest.steps) {
    if (!Array.isArray(step.argv) || step.argv.length === 0) throw new FixtureError('each step needs an argv array');
    const expected = step.expect?.reasonCode;
    if (!REASON_CODES.includes(expected)) throw new FixtureError(`unknown expected reason code ${JSON.stringify(expected)}`);
    const expectedExit = step.expect.exitCode ?? (expected === 'OK' ? 0 : 1);
    if (expectedExit !== (expected === 'OK' ? 0 : 1)) {
      throw new FixtureError(`exit code ${expectedExit} contradicts reason code ${expected}`);
    }
  }
}

/* -------------------------------------------------------------------- runner */

const caseFiles = readdirSync(casesPath)
  .filter((name) => name.endsWith('.json'))
  .sort();
if (caseFiles.length === 0) {
  process.stderr.write('usage error: no fixture cases found\n');
  process.exit(2);
}

const lines = [];
let stepCount = 0;
let mismatch = null;
let bindingIdempotencyChecked = 0;

for (const file of caseFiles) {
  if (selectedCase && selectedCase !== file.replace(/\.json$/, '')) continue;
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(join(casesPath, file), 'utf8'));
    validateManifest(manifest, file);
  } catch (error) {
    mismatch = { case: file, reasonCode: 'FAIL_FIXTURE_SETUP', detail: `${file}: ${error.message}` };
    break;
  }

  const workspace = mkdtempSync(join(tmpdir(), 'umliva-website-contract-fixture-'));
  try {
    const context = { trees: {}, statePath: join(workspace, 'state') };
    mkdirSync(context.statePath, { recursive: true });
    for (const [treeName, spec] of Object.entries(manifest.trees)) {
      const treePath = join(workspace, treeName);
      mkdirSync(treePath, { recursive: true });
      const source = spec.from === 'own' ? join(fixturesRoot, manifest.id, 'tree') : baseTreePath;
      if (!existsSync(source)) throw new FixtureError(`tree source for ${treeName} is missing`);
      cpSync(source, treePath, { recursive: true });
      context.trees[treeName] = treePath;
      applyGit(treePath, workspace, treeName, spec.git);
      applySetup(treePath, workspace, spec.setup || []);
    }

    const bindingPath = join(context.statePath, 'binding.json');
    let bindingSnapshot = null;
    for (const [index, step] of manifest.steps.entries()) {
      const args = step.argv.map((argument) => expandArgument(argument, context));
      const proc = spawnSync(process.execPath, [validatorPath, '--json', ...args], { encoding: 'utf8' });
      stepCount += 1;
      let observed = null;
      try {
        observed = JSON.parse((proc.stdout || '').trim());
      } catch {
        observed = null;
      }
      const observedCode = observed?.reasonCode ?? `UNPARSABLE(exit=${proc.status})`;
      const expectedCode = step.expect.reasonCode;
      const expectedExit = step.expect.exitCode ?? (expectedCode === 'OK' ? 0 : 1);
      if (observedCode !== expectedCode || proc.status !== expectedExit) {
        mismatch = {
          case: manifest.id,
          reasonCode: 'FAIL_FIXTURE_MISMATCH',
          detail: `case=${manifest.id} step=${index + 1} expect=${expectedCode}/exit${expectedExit} observed=${observedCode}/exit${proc.status} detail=${
            observed?.violations?.[0]?.detail ?? sanitize(proc.stdout || proc.stderr || 'no output', workspace)
          }`,
        };
        break;
      }
      lines.push(`PASS case=${manifest.id} step=${index + 1} expect=${expectedCode} observed=${observedCode} exit=${proc.status}`);
      if (observed && expectedCode === 'OK' && observed.violations.length > 0) {
        mismatch = { case: manifest.id, reasonCode: 'FAIL_FIXTURE_MISMATCH', detail: `case=${manifest.id} expected OK but reported violations` };
        break;
      }
      if (step.snapshotBinding) bindingSnapshot = hashFile(bindingPath);
      if (step.assertBindingUnchanged) {
        bindingIdempotencyChecked += 1;
        const current = hashFile(bindingPath);
        if (bindingSnapshot === null || current !== bindingSnapshot) {
          mismatch = {
            case: manifest.id,
            reasonCode: 'FAIL_FIXTURE_MISMATCH',
            detail: `case=${manifest.id} step=${index + 1} rebinding changed the binding state; rebinding must be idempotent`,
          };
          break;
        }
        lines.push(`PASS case=${manifest.id} step=${index + 1} bindingIdempotency=byte-identical`);
      }
    }
  } catch (error) {
    const detail = error instanceof FixtureError ? error.message : error.message;
    mismatch = { case: manifest.id, reasonCode: 'FAIL_FIXTURE_SETUP', detail: `case=${manifest.id} ${sanitize(detail, workspace)}` };
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
  if (mismatch) break;
}

for (const line of lines) process.stdout.write(`${line}\n`);

if (mismatch) {
  process.stdout.write(`FAIL agent-project-contract-fixtures reasonCode=${mismatch.reasonCode} case=${mismatch.case}\n`);
  process.stdout.write(`detail=${mismatch.detail}\n`);
  process.exit(1);
}

const caseCount = selectedCase ? 1 : caseFiles.length;
process.stdout.write(
  `PASS agent-project-contract-fixtures reasonCode=OK cases=${caseCount} steps=${stepCount} mismatches=0 bindingIdempotencyChecks=${bindingIdempotencyChecked}\n`
);
process.exit(0);
