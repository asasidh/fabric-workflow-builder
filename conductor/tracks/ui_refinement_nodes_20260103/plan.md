# Track Plan: UI Refinement: Node Status & Execution Details

## Phase 1: Data Model & Status Indicators
- [ ] Task: Frontend: Update `PatternNode` to accept and visualize status props (idle, running, success, error)
- [ ] Task: Frontend: Add mock visual states to other nodes (Input, End) if applicable
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Data Model & Status Indicators' (Protocol in workflow.md)

## Phase 2: Node Detail Sidebar
- [ ] Task: Frontend: Create `NodeDetailSidebar` component with Input/Output/Error tabs
- [ ] Task: Frontend: Integrate `react-markdown` for rich text rendering in the sidebar
- [ ] Task: Frontend: Update `Canvas` layout to include the Detail Sidebar (collapsible or fixed on right)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Node Detail Sidebar' (Protocol in workflow.md)

## Phase 3: Integration & Interaction
- [ ] Task: Frontend: Wire up node selection to open the Detail Sidebar
- [ ] Task: Frontend: Update `Canvas` execution logic to update node status and data (input/output) instead of direct label display
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration & Interaction' (Protocol in workflow.md)
