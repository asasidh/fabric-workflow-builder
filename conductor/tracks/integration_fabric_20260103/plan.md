# Track Plan: Integration: Real Fabric Execution & Pattern Scanning

## Phase 1: Fabric Detection & Status [checkpoint: 556aed5]
- [x] Task: Backend: Implement logic to detect `fabric` binary or API 7221267
- [x] Task: Backend: Create `/api/status` endpoint b0dca10
- [x] Task: Frontend: Create `StatusIndicator` component (Green/Red/Loading) and place it in the UI 4841772
- [x] Task: Conductor - User Manual Verification 'Phase 1: Fabric Detection & Status' (Protocol in workflow.md) 556aed5

## Phase 2: Pattern Discovery (API-first) [checkpoint: 78effcb]
- [x] Task: Backend: Implement logic to list patterns via `GET /patterns/names` d0bbf1f
- [x] Task: Backend: Create `/api/patterns` endpoint 6b3fac5
- [x] Task: Frontend: Update `Sidebar` to fetch and display patterns from the API 9234747
- [x] Task: Conductor - User Manual Verification 'Phase 2: Pattern Discovery' (Protocol in workflow.md) 78effcb

## Phase 3: Real Execution Engine (API-first) [checkpoint: 118989f]
- [x] Task: Backend: Refactor execution engine to use `POST /patterns/:name/apply` e140cb8
- [x] Task: Backend: Implement input handling and result capture via API e140cb8
- [x] Task: Backend: Handle API errors and propagation e140cb8
- [x] Task: Conductor - User Manual Verification 'Phase 3: Real Execution Engine' (Protocol in workflow.md) 118989f
