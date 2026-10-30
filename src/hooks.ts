import type {
  HookCallback,
  HookCallbackMatcher,
  HookEvent,
} from "@anthropic-ai/claude-agent-sdk";

// Hooks run your code at points in the agent loop. This one logs each tool
// call to stderr. A PreToolUse hook can also block a call by returning
// { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", ... } }.
const logToolUse: HookCallback = async (input) => {
  if (input.hook_event_name === "PreToolUse") {
    console.error(`→ ${input.tool_name} ${JSON.stringify(input.tool_input)}`);
  }
  return {};
};

export const hooks: Partial<Record<HookEvent, HookCallbackMatcher[]>> = {
  PreToolUse: [{ hooks: [logToolUse] }],
};
