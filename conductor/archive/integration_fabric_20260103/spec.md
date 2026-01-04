# Track Spec: Integration: Real Fabric Execution & Pattern Scanning

## Overview
This track focuses on replacing the mock execution engine with real integration to the local `fabric` CLI. It also involves dynamically discovering available patterns and providing visual feedback on the system's status.

## User Stories
- **Status Indication:** As a user, I want to see a visual indicator (Green/Red) at the top of the app showing if the backend is successfully connected to the local `fabric` installation.
- **Pattern Discovery:** As a user, I want the sidebar to list the actual Fabric patterns installed on my machine, not hardcoded mocks.
- **Real Execution:** As a user, when I run a workflow, I want the backend to execute the actual `fabric` commands and return the real AI-generated output.

## Technical Requirements
- **Backend:**
    -   Use Node.js `child_process` to execute shell commands.
    -   Implement `/api/status` to check `fabric --version` or presence.
    -   Implement `/api/patterns` to parse output of `fabric --list`.
    -   Update `/api/execute` to spawn processes for each pattern node, piping input via stdin and capturing stdout.
- **Frontend:**
    -   New `StatusIndicator` component.
    -   Update `Sidebar` to fetch data from `/api/patterns`.
    -   Handle potential timeouts or errors from long-running AI tasks.

## Success Criteria
- A green dot appears in the UI when `fabric` is available in the system path.
- The sidebar populates with at least one real pattern found on the host system.
- Executing a "Summarize" node (or similar) with text input produces a real summary from the configured LLM.
