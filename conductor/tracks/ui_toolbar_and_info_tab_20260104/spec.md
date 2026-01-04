# Track Spec: UI Toolbar & Pattern Info

## Overview
This track focuses on improving the UI layout and information density. It involves moving the execution controls to a dedicated top toolbar to clear up space and adding an "Info" tab to the Node Detail Sidebar to display detailed pattern specifications.

## User Stories
- **Top Toolbar:** As a user, I want the action buttons (Run, Export, Delete, Clear) and status indicator to be in a consistent toolbar at the top of the screen, so they are always accessible and don't overlap with the canvas content or sidebar.
- **Pattern Info:** As a user, when I select a Pattern Node, I want to see an "Info" tab in the sidebar that shows the pattern's description or README, so I can understand what the pattern does without leaving the app.

## Technical Requirements
- **Frontend:**
    -   Create a new `Toolbar` component.
    -   Refactor `Canvas.tsx` to remove the `Panel` containing controls and place the `Toolbar` above the `ReactFlow` component.
    -   Update `NodeDetailSidebar.tsx` to include an 'Info' tab.
    -   Update `PatternNode` data to include pattern description/content.
- **Backend:**
    -   Update `/api/patterns` to include pattern descriptions/README content if possible, or create a new endpoint `/api/patterns/:name/info` to fetch it on demand.
    -   Alternatively, if the pattern list already has some metadata, ensure it's passed to the frontend.

## Success Criteria
- A top toolbar exists containing: Status Indicator, Run Workflow, Export JSON, Delete Selected, Clear Canvas.
- Selecting a Pattern Node shows an "Info" tab in the sidebar.
- The "Info" tab displays text describing the pattern.
