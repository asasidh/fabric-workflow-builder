# Track Spec: Data Flow Transparency & Chaining

## Overview
Ensure that data is correctly chained between nodes and that the user can visually inspect both the input and output of every node after execution.

## User Stories
- **Inspect Inputs:** As a user, I want to click on any node in a completed workflow and see exactly what text was passed to it as input in the sidebar's "Input" tab.
- **Inspect Outputs:** As a user, I want to see the result of each node in the sidebar's "Output" tab.
- **Visual Chaining:** As a user, I want to be confident that the output of one pattern is being used as the input for the next connected pattern.

## Technical Requirements
- **Frontend:**
    -   Update `onExecute` in `Canvas.tsx` to map the `inputs` object returned by the server back into the node data.
    -   Ensure `NodeDetailSidebar` correctly displays `data.input`.
- **Backend:**
    -   Verify that the topological sort and data joining logic correctly handle multiple inputs.
    -   Ensure `applyPattern` is working correctly with the CLI.

## Success Criteria
- Executing a workflow updates all nodes with their specific inputs and outputs.
- The "Input" tab in the sidebar for a Pattern Node shows the combined output of its predecessor nodes.
- The "Output" tab shows the result of the Fabric pattern execution.
