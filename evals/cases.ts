import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// What one run of the agent did, for a case's check to inspect.
export interface Run {
  answer: string;
  toolCalls: { name: string; input: Record<string, unknown> }[];
}

export interface EvalCase {
  name: string;
  prompt: string;
  // Throws if the run fails the case. node:assert gives readable messages.
  check: (run: Run) => void;
}

// Prefer checks on tool calls and their inputs. The wording of answers
// changes between runs, so a check on answer text should look for one key
// fact, not a sentence.

// The agent runs in the current directory, so it should find this same name.
const packageName: string = JSON.parse(readFileSync("package.json", "utf8")).name;

export const cases: EvalCase[] = [
  {
    name: "time zone question uses current_time",
    prompt: "What time is it in Tokyo right now?",
    check: ({ toolCalls }) => {
      const call = toolCalls.find((c) => c.name === "mcp__utils__current_time");
      assert.ok(call, "expected a call to mcp__utils__current_time");
      assert.equal(call.input.timeZone, "Asia/Tokyo");
    },
  },
  {
    name: "project question is answered from the files",
    prompt: "What is this project's package name?",
    check: ({ answer, toolCalls }) => {
      assert.ok(toolCalls.length > 0, "expected the agent to look at the files");
      assert.ok(answer.includes(packageName), `expected the answer to mention "${packageName}"`);
    },
  },
];
