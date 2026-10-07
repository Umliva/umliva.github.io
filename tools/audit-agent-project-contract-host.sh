#!/usr/bin/env bash
#
# tools/audit-agent-project-contract-host.sh
#
# Host-local audit of the project-local agent contract of this repository.
#
# It prints one row per audited item with PASS, FAIL or NOT_VERIFIED, then a
# summary. NOT_VERIFIED means the fact is unavailable or not observable with the
# available tooling; it is never a PASS and an unavailable host is never a PASS.
#
# This script audits the workstation that runs it. It never inspects another
# host and repository CI cannot run it against a user's host, so no CI job may
# claim a host audit result. Output contains counts and labels only: no home
# paths, no secrets and no global configuration contents.
#
# Exit codes: 0 = no FAIL, 1 = at least one FAIL, 2 = usage error.
#
# Usage: bash tools/audit-agent-project-contract-host.sh [--help]
set -uo pipefail

if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  sed -n '2,20p' "$0"
  exit 0
fi
if [ "$#" -gt 0 ]; then
  printf 'usage error: unknown argument %s\n' "$1" >&2
  exit 2
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"
validator="${repo_root}/tools/verify-agent-project-contract.mjs"
fixture_runner="${repo_root}/tools/run-agent-project-contract-fixtures.mjs"

pass_count=0
fail_count=0
not_verified_count=0
rows=()

record() { # record <item> <status> <detail>
  local item="$1" status="$2" detail="$3"
  rows+=("item=${item} status=${status} detail=${detail}")
  case "${status}" in
    PASS) pass_count=$((pass_count + 1)) ;;
    FAIL) fail_count=$((fail_count + 1)) ;;
    *) not_verified_count=$((not_verified_count + 1)) ;;
  esac
}

# Fails atomically when any of the project identity markers is absent, so the
# FAIL path of this audit is exercised on every run without touching host data.
negative_control() {
  local tmp
  tmp="$(mktemp -d "${TMPDIR:-/tmp}/umliva-apc-audit-XXXXXX")" || return 1
  local observed
  observed="$(node "${validator}" --root "${tmp}" --json 2>/dev/null \
    | grep -o '"reasonCode":"[A-Z_]*"' | head -n 1 | sed 's/.*:"//; s/"//')"
  rm -rf "${tmp}"
  printf '%s\n' "${observed:-UNOBSERVED}"
}

if [ ! -f "${validator}" ]; then
  printf 'FAIL agent-project-contract-host-audit reasonCode=FAIL_AUDIT_SETUP\n'
  printf 'detail=host audit requires tools/verify-agent-project-contract.mjs next to this script\n'
  exit 1
fi

# 1. Contract validation of the real repository root.
validator_first="$(node "${validator}" --json 2>/dev/null)"
validator_second="$(node "${validator}" --json 2>/dev/null)"
validator_code="$(printf '%s' "${validator_first}" | grep -o '"reasonCode":"[A-Z_]*"' | head -n 1 | sed 's/.*:"//; s/"//')"
if [ "${validator_code}" = "OK" ]; then
  record contract-validator PASS "reasonCode=OK"
else
  record contract-validator FAIL "reasonCode=${validator_code:-UNOBSERVED}"
fi

# 2. Deterministic output: two consecutive runs must be byte-identical.
if [ -n "${validator_first}" ] && [ "${validator_first}" = "${validator_second}" ]; then
  record deterministic-output PASS "runs=2 identical=yes"
else
  record deterministic-output FAIL "runs=2 identical=no"
fi

# 3. Fixture suite (negative fixtures must fail with their expected reason code).
fixtures_summary="$(node "${fixture_runner}" 2>/dev/null | tail -n 1)"
fixtures_code="$(printf '%s' "${fixtures_summary}" | grep -o 'reasonCode=[A-Z_]*' | head -n 1 | cut -d= -f2)"
fixtures_counts="$(printf '%s' "${fixtures_summary}" | grep -o 'cases=[0-9]* steps=[0-9]* mismatches=[0-9]*' | head -n 1)"
if [ "${fixtures_code}" = "OK" ]; then
  record fixture-suite PASS "${fixtures_counts:-cases=unknown}"
else
  record fixture-suite FAIL "reasonCode=${fixtures_code:-UNOBSERVED}"
fi

# 4. Negative control: the audit must be able to report FAIL.
probe="$(negative_control)"
case "${probe}" in
  FAIL_*) record negative-control PASS "probe=${probe} synthetic-root=yes" ;;
  OK) record negative-control FAIL "probe=OK a broken synthetic root was accepted" ;;
  *) record negative-control FAIL "probe=${probe} negative control did not produce a verdict" ;;
esac

# 5. Canonical remote identity as resolved by the validator on this checkout.
identity_kind="$(printf '%s' "${validator_first}" | grep -o '"identityKind":"[a-z-]*"' | head -n 1 | sed 's/.*:"//; s/"//')"
case "${identity_kind}" in
  canonical|approved-fork) record git-remote-identity PASS "identityKind=${identity_kind}" ;;
  none|"") record git-remote-identity NOT_VERIFIED "identityKind=unresolved" ;;
  *) record git-remote-identity NOT_VERIFIED "identityKind=${identity_kind}" ;;
esac

# 6. Global instruction files: project-specific global authority must not exist.
home_dir="${HOME:-}"
if [ -z "${home_dir}" ] || [ ! -d "${home_dir}" ]; then
  record global-instruction-audit NOT_VERIFIED "home=unresolvable"
else
  instruction_candidates=(
    "${home_dir}/.codex/AGENTS.md"
    "${home_dir}/.codex/AGENTS.override.md"
    "${home_dir}/.agents/AGENTS.md"
    "${home_dir}/.claude/AGENTS.md"
    "${home_dir}/.claude/CLAUDE.md"
    "${home_dir}/.zcode/AGENTS.md"
  )
  existing=0
  project_specific=0
  foreign_specific=0
  unreadable=0
  for candidate in "${instruction_candidates[@]}"; do
    [ -f "${candidate}" ] || continue
    existing=$((existing + 1))
    if [ ! -r "${candidate}" ]; then
      unreadable=$((unreadable + 1))
      continue
    fi
    if grep -q -i -F 'umliva.github.io' "${candidate}" 2>/dev/null; then
      project_specific=$((project_specific + 1))
    fi
    if grep -q -E 'de\.muellersystemslab\.umliva|Umliva/Umliva|Morphelis_API_36' "${candidate}" 2>/dev/null; then
      foreign_specific=$((foreign_specific + 1))
    fi
  done
  detail="instruction-files=${existing} project-specific=${project_specific} foreign-project-specific=${foreign_specific} unreadable=${unreadable}"
  if [ "${unreadable}" -gt 0 ]; then
    record global-instruction-audit NOT_VERIFIED "${detail}"
  elif [ "${project_specific}" -gt 0 ] || [ "${foreign_specific}" -gt 0 ]; then
    record global-instruction-audit FAIL "${detail}"
  else
    record global-instruction-audit PASS "${detail}"
  fi
fi

# 7. Global skills: advertised project-specific global skills must not exist.
if [ -z "${home_dir}" ] || [ ! -d "${home_dir}" ]; then
  record global-skill-scope-audit NOT_VERIFIED "home=unresolvable"
else
  skill_roots=0
  skills=0
  project_specific_skills=0
  foreign_specific_skills=0
  unreadable_skills=0
  for root in "${home_dir}/.agents/skills" "${home_dir}/.codex/skills" "${home_dir}/.claude/skills" "${home_dir}/.zcode/skills"; do
    [ -d "${root}" ] || continue
    skill_roots=$((skill_roots + 1))
    while IFS= read -r skill_file; do
      [ -n "${skill_file}" ] || continue
      skills=$((skills + 1))
      if [ ! -r "${skill_file}" ]; then
        unreadable_skills=$((unreadable_skills + 1))
        continue
      fi
      if grep -q -i -F 'umliva.github.io' "${skill_file}" 2>/dev/null; then
        project_specific_skills=$((project_specific_skills + 1))
      fi
      if grep -q -E 'de\.muellersystemslab\.umliva|Umliva/Umliva|Morphelis_API_36' "${skill_file}" 2>/dev/null; then
        foreign_specific_skills=$((foreign_specific_skills + 1))
      fi
    done < <(find "${root}" -maxdepth 3 -type f -name 'SKILL.md' 2>/dev/null | sort)
  done
  skill_detail="skill-roots=${skill_roots} advertised-skills=${skills} project-specific=${project_specific_skills} foreign-project-specific=${foreign_specific_skills} unreadable=${unreadable_skills}"
  if [ "${unreadable_skills}" -gt 0 ]; then
    record global-skill-scope-audit NOT_VERIFIED "${skill_detail}"
  elif [ "${project_specific_skills}" -gt 0 ] || [ "${foreign_specific_skills}" -gt 0 ]; then
    record global-skill-scope-audit FAIL "${skill_detail}"
  else
    record global-skill-scope-audit PASS "${skill_detail}"
  fi
fi

# 8. Coverage of global configuration discovery: not enumerable offline.
record global-config-coverage NOT_VERIFIED "audited-candidate-paths=documented unknown-harness-locations=not-enumerable"

# 9. Skill activation state cannot be observed offline: advertised metadata only.
record skill-activation-verification NOT_VERIFIED "TOOL_GAP advertised-metadata-only"

# 10. Write enforcement: this repository configures no hook or broker that could
# intercept a write, and a validator cannot block a write by itself.
hook_config=absent
for candidate in .codex/hooks.json .zcode/hooks.json .github/hooks.json; do
  if [ -e "${repo_root}/${candidate}" ]; then hook_config=present; fi
done
record write-enforcement NOT_VERIFIED "TOOL_GAP hook-config=${hook_config} validator-is-not-a-write-interceptor"

# 11. Other workstations are out of scope of this run.
record host-coverage NOT_VERIFIED "workstations=1 other-hosts=NOT_VERIFIED"

for row in "${rows[@]}"; do
  printf '%s\n' "${row}"
done
printf 'summary PASS=%s FAIL=%s NOT_VERIFIED=%s\n' "${pass_count}" "${fail_count}" "${not_verified_count}"
printf 'ci-host-inspection=NOT_POSSIBLE host-audit-scope=this-workstation-only\n'

if [ "${fail_count}" -gt 0 ]; then
  printf 'FAIL agent-project-contract-host-audit reasonCode=FAIL_HOST_AUDIT\n'
  exit 1
fi
printf 'PASS agent-project-contract-host-audit reasonCode=OK\n'
exit 0
