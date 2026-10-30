import type { Options } from "@anthropic-ai/claude-agent-sdk";
import { hooks } from "./hooks.js";
import { utilsServer } from "./tools.js";

const SYSTEM_PROMPT = `You are a helpful assistant that answers questions about the project in the
current directory. Use your tools to look things up rather than guessing.`;

export const agentOptions: Options = {
  model: process.env.CLAUDE_MODEL ?? "claude-opus-5-5",
  systemPrompt: SYSTEM_PROMPT,

  // Built-in tools the agent can see. Read-only by default; add "Edit",
  // "Write" or "Bash" when your agent needs to change things.
  tools: ["Read", "Glob", "Grep"],
  mcpServers: { utils: utilsServer },

  // Tools that run without asking. With "dontAsk", anything not listed here
  // is denied, which suits a script with no one around to approve prompts.
  allowedTools: ["Read", "Glob", "Grep", "mcp__utils__current_time"],
  permissionMode: "dontAsk",

  hooks,

  // Don't load ~/.claude or .claude/ settings, so the agent behaves the same
  // on every machine. Add "project" to pick up CLAUDE.md and .claude/ files.
  settingSources: [],

  // Guardrails so a runaway loop can't burn through your API credits.
  maxTurns: 20,
  maxBudgetUsd: 1,
};
