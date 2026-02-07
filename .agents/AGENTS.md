# Agent Directives & Efficiency Protocol

## Behavioral Constraints
- **Dry Run First:** Before implementing, output a bulleted "Execution Plan." Stop and wait for user approval if changes affect >3 files.
- **Incremental Implementation:** Complete one logical sub-task at a time. Do not attempt "all-in-one" solutions.
- **Manual QA:** DO NOT perform automated testing (curl, diagnostics sweeps) unless explicitly requested. The user will verify and provide logs if needed.
- **Concise Outputs:** Avoid polite filler, restating the prompt, or lengthy summaries. Focus 100% on logic and code.

## Token Economy
- **Lazy Reading:** Do not read entire directories. If a file path isn't provided, ask the user before scanning the filesystem.
- **MCP Usage:** You have access to the Context7 MCP. 
    - **Mandatory Retrieval:** You MUST use MCP for Next.js 15 (Server Actions, Metadata, Caching) or any library updated after 2024.
    - **No Browsing:** Use specific queries. Do not "browse" docs; find the API reference and exit.
- **No Refactoring:** Do not touch unrelated code. Fix only what is requested.

## Memory Management
- If the "Chain of Thought" or chat history becomes long, suggest a "Context Reset" to the user to save costs.
