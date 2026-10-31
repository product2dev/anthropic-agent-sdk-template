# AGENTS.md

Instructions for coding agents working in this repo. People should start with `README.md`.

This is a TypeScript agent built on the Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`). `src/index.ts` runs `query()`. Everything that shapes the agent's behavior (model, system prompt, tools, permissions, limits) is in `src/agent.ts`.

## Commands

| Command | When to run it |
| --- | --- |
| `npm run typecheck` | After every change. It's the main check; there are no unit tests. |
| `npm run eval` | After changing the system prompt, model, tools or permissions. Calls the API and costs money. |
| `npm start -- "<prompt>"` | Only when asked. Calls the API and costs money. |

## Gotchas

- **Adding a custom tool takes two edits.** Define it with `tool()` and add it to the server's `tools` array in `src/tools.ts`, then add `mcp__utils__<tool_name>` to `allowedTools` in `src/agent.ts`. `permissionMode` is `"dontAsk"`, so a tool missing from `allowedTools` is denied without an error and the agent just can't use it.
- **Built-in tools work the same way.** List them in both `tools` and `allowedTools`.
- **The defaults are read-only on purpose.** Don't add `Edit`, `Write` or `Bash`, or raise `maxTurns` or `maxBudgetUsd`, unless asked.
- **Instructions for the agent go in `SYSTEM_PROMPT`**, not in this file. This file is for you.
- **stdout is for the agent's replies only.** `src/index.ts` sends tool calls, cost and errors to stderr so the output can be piped. Keep it that way.
- **Relative imports end in `.js`** (`./agent.js`), because the project uses NodeNext module resolution.
- **Keep secrets in `.env`**, which is gitignored. Add new variables to `.env.example` without values.

## Evals

`evals/cases.ts` holds the cases and `evals/run.ts` runs them. When you change what the agent does, add or update a case. Check tool calls and their inputs where you can. The wording of answers changes between runs, so a check on answer text should look for one key fact, not a sentence.
