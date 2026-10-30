# anthropic-agent-sdk-template

A minimal TypeScript starter for building agents with the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview). It includes a working agent with a custom tool, a hook, and safe defaults that you can build on.

## Use this template

On GitHub, click **Use this template → Create a new repository**. Or, with the GitHub CLI:

```sh
gh repo create my-agent --template product2dev/anthropic-agent-sdk-template --private --clone
```

## Quick start

You need Node.js 20 or newer and a [Claude API key](https://platform.claude.com/settings/keys).

```sh
npm install
cp .env.example .env        # then paste your key into .env
npm start -- "What files are in this project?"
```

If you run `npm start` without a prompt, it uses a default one. The agent's replies go to stdout. Tool calls, cost and errors go to stderr.

## Project layout

| File | What it's for |
| --- | --- |
| `src/index.ts` | Entry point. Runs `query()` and prints the agent's messages. |
| `src/agent.ts` | Agent configuration: model, system prompt, tools, permissions and limits. |
| `src/tools.ts` | Custom tools, served to the agent by an in-process MCP server. |
| `src/hooks.ts` | Hooks that run your code at points in the agent loop. |

## Customizing

- **Prompt and model:** edit `SYSTEM_PROMPT` and `model` in `src/agent.ts`, or set `CLAUDE_MODEL` in `.env`.
- **Add a custom tool:** define it with `tool()` in `src/tools.ts` and add it to the server's `tools` array. Then add `mcp__utils__<tool_name>` to `allowedTools` in `src/agent.ts`.
- **Let the agent change files or run commands:** add `"Edit"`, `"Write"` or `"Bash"` to both `tools` and `allowedTools`. The defaults are read-only on purpose.
- **Load `CLAUDE.md` and `.claude/` settings:** set `settingSources: ["project"]`.
- **Limits:** `maxTurns` (20) and `maxBudgetUsd` ($1) stop a run that gets out of hand. Raise them as needed.

The [TypeScript SDK reference](https://code.claude.com/docs/en/agent-sdk/typescript) lists every option.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start -- "<prompt>"` | Run the agent |
| `npm run typecheck` | Type-check without building |
| `npm run build` | Compile to `dist/` |

## Authentication

The SDK reads `ANTHROPIC_API_KEY` from the environment. The template loads `.env` for you. To use Amazon Bedrock, Google Vertex AI or Microsoft Foundry instead, see the [Agent SDK quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart).

Use API key authentication for anything you ship. Unless Anthropic has approved it, a product built on the Agent SDK may not offer claude.ai login or claude.ai rate limits to its users.

## Building a product on this

Anthropic's [branding guidelines](https://code.claude.com/docs/en/agent-sdk/overview#branding-guidelines) apply. You can say "Powered by Claude". Don't call your product "Claude Code", and don't make it look like Claude Code. Use of the SDK is governed by [Anthropic's Commercial Terms](https://www.anthropic.com/legal/commercial-terms).

## Resources

- [Agent SDK docs](https://code.claude.com/docs/en/agent-sdk/overview)
- [Example agents](https://github.com/anthropics/claude-agent-sdk-demos)
- [TypeScript SDK changelog](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)

## License

[MIT](LICENSE)
