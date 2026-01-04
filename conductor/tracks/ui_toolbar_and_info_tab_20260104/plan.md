# Track Plan: UI Toolbar & Pattern Info

## Phase 1: Top Toolbar Layout [checkpoint: d6aecb1]
- [x] Task: Frontend: Create `Toolbar` component with existing control buttons and status indicator 2f866b3
- [x] Task: Frontend: Refactor `Canvas` to use `Toolbar` at the top and remove the React Flow `Panel` 2f866b3
- [x] Task: Conductor - User Manual Verification 'Phase 1: Top Toolbar Layout' (Protocol in workflow.md) d6aecb1

## Phase 2: Pattern Information Support [checkpoint: 67f89e0]
- [x] Task: Backend: Investigate `fabric` CLI or pattern folders to extract pattern descriptions/READMEs 657df94
- [x] Task: Backend: Update `/api/patterns` or add endpoint to serve pattern details 657df94
- [x] Task: Frontend: Update `Sidebar` (library) to pass pattern metadata when dragging? Or fetch on select?
    - *Decision:* Fetching on select might be better for heavy text. Let's decide to fetch on select or include in initial load if small.
- [x] Task: Frontend: Update `NodeDetailSidebar` to add 'Info' tab and display description 657df94
- [x] Task: Conductor - User Manual Verification 'Phase 2: Pattern Information Support' (Protocol in workflow.md) 67f89e0
