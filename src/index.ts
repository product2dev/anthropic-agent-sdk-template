import { query } from "@anthropic-ai/claude-agent-sdk";
import { agentOptions } from "./agent.js";

try {
  process.loadEnvFile();
} catch {
  // No .env file; use the shell environment as-is.
}

const prompt =
  process.argv.slice(2).join(" ") ||
  "What time is it in Tokyo, and what does this project do?";

for await (const message of query({ prompt, options: agentOptions })) {
  switch (message.type) {
    case "assistant":
      for (const block of message.message.content) {
        if (block.type === "text") console.log(block.text);
      }
      break;

    case "result":
      if (message.subtype === "success") {
        console.error(
          `\n✓ ${message.num_turns} turns · $${message.total_cost_usd.toFixed(4)}`,
        );
      } else {
        console.error(`\n✗ ${message.subtype}: ${message.errors.join("; ")}`);
        process.exitCode = 1;
      }
      break;
  }
}
