import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// Custom tools run in-process as an MCP server. The agent sees each tool as
// `mcp__<server key>__<tool name>`, e.g. `mcp__utils__current_time`.

const currentTime = tool(
  "current_time",
  "Get the current date and time, optionally in a specific IANA time zone such as 'Asia/Tokyo'.",
  {
    timeZone: z
      .string()
      .optional()
      .describe("IANA time zone name. Defaults to the machine's local time zone."),
  },
  async ({ timeZone }) => {
    try {
      const now = new Date().toLocaleString("en-US", {
        timeZone,
        dateStyle: "full",
        timeStyle: "long",
      });
      return { content: [{ type: "text", text: now }] };
    } catch {
      return {
        content: [{ type: "text", text: `Unknown time zone: ${timeZone}` }],
        isError: true,
      };
    }
  },
  { annotations: { readOnlyHint: true } },
);

export const utilsServer = createSdkMcpServer({
  name: "utils",
  version: "1.0.0",
  tools: [currentTime],
});
