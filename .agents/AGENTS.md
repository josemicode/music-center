# Agent Directives & Efficiency Protocol

## Behavioral Constraints
- **Incremental Implementation:** Complete one logical sub-task at a time. Do not attempt "all-in-one" solutions. You may carry out multiple of them if the user intends you to.
- **Manual QA:** DO NOT perform automated testing (curl, diagnostics sweeps) unless explicitly requested. The user will verify and provide logs if needed; do specify what should be tested.
- **Concise Outputs:** Avoid polite filler, restating the prompt, or lengthy summaries. Focus 100% on logic and code.

## Token Economy
- **Lazy Reading:** Do not read entire directories. If a file path isn't provided, ask the user before scanning the filesystem.
- **Missing context:** You have the right to ask for the docs of whatever you need in case the information you have is outdated and has changed. 
- **No Refactoring:** Do not touch unrelated code. Fix only what is requested.

## Memory Management
- If the "Chain of Thought" or chat history becomes long, suggest a "Context Reset" to the user to save costs.
