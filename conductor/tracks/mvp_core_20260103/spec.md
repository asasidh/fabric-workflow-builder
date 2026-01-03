# Track Spec: MVP: Core Canvas & Workflow Execution

## Overview
This track focuses on building the foundational visual workflow builder. Users will be able to drag Fabric patterns onto a canvas, connect them, and execute a simple chain of operations.

## User Stories
- **Canvas Interaction:** As a user, I want to drag patterns from a library onto a canvas and connect them with lines.
- **Pattern Library:** As a user, I want to see a list of available Fabric patterns (e.g., "summarize", "extract_wisdom") in a sidebar.
- **Execution:** As a user, I want to provide input text, run the workflow, and see the output of each pattern in the chain.
- **Persistence:** As a user, I want my canvas state to be saved automatically to local storage.

## Technical Requirements
- **Frontend:** React, TypeScript, React Flow, Tailwind CSS, Framer Motion.
- **Backend:** Node.js/Express (local server) to bridge to the `fabric` CLI.
- **Data Model:** A JSON-based graph representation of nodes (patterns) and edges (data flow).

## Success Criteria
- A functional React Flow canvas where nodes can be added, connected, and deleted.
- A sidebar that lists at least 3 mock Fabric patterns.
- An "Execute" button that sends the workflow to the backend and retrieves results.
- Workflow state persists across page refreshes.
