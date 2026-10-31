import { query } from "@anthropic-ai/claude-agent-sdk";
import { agentOptions } from "../src/agent.js";
import { cases, type Run } from "./cases.js";

try {
  process.loadEnvFile();
} catch {
  // No .env file; use the shell environment as-is.
}

// `npm run eval -- <text>` runs only the cases whose name contains <text>.
const filter = process.argv.slice(2).join(" ");
const selected = cases.filter((c) => c.name.includes(filter));
if (selected.length === 0) {
  console.error(`No eval cases match "${filter}".`);
  process.exit(1);
}

let failed = 0;
let totalCost = 0;

for (const evalCase of selected) {
  const run: Run = { answer: "", toolCalls: [] };

  try {
    for await (const message of query({ prompt: evalCase.prompt, options: agentOptions })) {
      if (message.type === "assistant") {
        for (const block of message.message.content) {
          if (block.type === "tool_use") {
            run.toolCalls.push({ name: block.name, input: block.input as Record<string, unknown> });
          }
        }
      } else if (message.type === "result") {
        totalCost += message.total_cost_usd;
        if (message.subtype !== "success") {
          throw new Error(`${message.subtype}: ${message.errors.join("; ")}`);
        }
        run.answer = message.result;
      }
    }

    evalCase.check(run);
    console.log(`✓ ${evalCase.name}`);
  } catch (err) {
    failed++;
    console.log(`✗ ${evalCase.name}\n  ${err instanceof Error ? err.message : err}`);
  }
}

console.log(`\n${selected.length - failed}/${selected.length} passed · $${totalCost.toFixed(4)}`);
if (failed > 0) process.exitCode = 1;
