#!/bin/bash
# HIVE-1433: the Trollspace key lives in Agent Vault (default vault, service trollspace-api);
# the vault proxy replaces the placeholder bearer. Token is per agent; Eve's bridge id "main" maps to eve.
set -eu
agent=${BRIDGE_AGENT_ID:?BRIDGE_AGENT_ID unset: no agent vault token to use}
[ "$agent" = main ] && agent=eve
token=/home/eve/config/agent-vault/$agent-default.token
export AGENT_VAULT_TOKEN="$(cat "$token")" AGENT_VAULT_ADDR=http://127.0.0.1:14321 AGENT_VAULT_VAULT=default
export TROLLSPACE_API_KEY=vault-injected-placeholder
exec agent-vault vault run --isolation host -- "$@"
