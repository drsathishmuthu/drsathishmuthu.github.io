#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if ! claude plugin marketplace list 2>/dev/null | grep -q "caveman"; then
  claude plugin marketplace add JuliusBrussee/caveman >&2
fi

if ! claude plugin list 2>/dev/null | grep -q "caveman@caveman"; then
  claude plugin install caveman@caveman >&2
fi

cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "The caveman plugin is installed and enabled. Activate caveman compression mode (full) for this session per the caveman skill's instructions."
  }
}
EOF
