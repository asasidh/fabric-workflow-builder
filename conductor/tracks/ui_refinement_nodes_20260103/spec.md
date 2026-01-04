# Track Spec: UI Refinement: Node Status & Execution Details

## Overview
This track aims to declutter the canvas by moving detailed execution inputs/outputs to a dedicated sidebar "Sidecar" and adding visual status indicators to the nodes.

## User Stories
- **Visual Status:** As a user, I want to see at a glance if a node is Pending, Running, Completed, or Failed, without the node expanding to show large amounts of text.
- **Detail Inspection:** As a user, I want to click on a node to see its full Input, Output, and Error details in a side panel.
- **Rich Output:** As a user, I want the output (likely Markdown) to be rendered with proper formatting in the detail view.

## Technical Requirements
- **Frontend:**
    -   Update `PatternNode`, `StartNode`, `EndNode`, `InputNode` to support visual status states (e.g., border color changes, spinners, icons).
    -   Implement a new `NodeDetailSidebar` component.
    -   Manage selection state to trigger the Sidebar.
    -   Use a Markdown renderer (e.g., `react-markdown`) for the output in the sidebar.
- **Data Model:**
    -   Extend node data to track `status` ('idle', 'running', 'success', 'error'), `input` (text), `output` (text), and `error` (text).

## Success Criteria
- Nodes on the canvas remain compact during execution.
- A spinner or "Running" label appears on nodes currently executing.
- Completed nodes show a checkmark or green border.
- Clicking a node opens the Detail Sidebar.
- The Sidebar displays tabs for Input/Output/Error and renders Markdown content correctly.
