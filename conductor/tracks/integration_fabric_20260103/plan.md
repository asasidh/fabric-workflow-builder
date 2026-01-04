# Track Plan: Integration: Real Fabric Execution & Pattern Scanning

## Phase 1: Fabric Detection & Status
- [x] Task: Backend: Implement logic to detect `fabric` binary and version 7221267
- [x] Task: Backend: Create `/api/status` endpoint b0dca10
- [x] Task: Frontend: Create `StatusIndicator` component (Green/Red/Loading) and place it in the UI 4841772
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Fabric Detection & Status' (Protocol in workflow.md)

## Phase 2: Pattern Discovery
- [ ] Task: Backend: Implement logic to list patterns (parse `fabric --list`)
- [ ] Task: Backend: Create `/api/patterns` endpoint
- [ ] Task: Frontend: Update `Sidebar` to fetch and display patterns from the API
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Pattern Discovery' (Protocol in workflow.md)

## Phase 3: Real Execution Engine
- [ ] Task: Backend: Refactor execution engine to use `child_process.spawn` for `fabric` commands
- [ ] Task: Backend: Implement input piping (stdin) and output capture (stdout) for nodes
- [ ] Task: Backend: Handle execution errors (stderr) and propagation
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Real Execution Engine' (Protocol in workflow.md)
