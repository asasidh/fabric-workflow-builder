# Track Spec: Pattern Management: Search & Creation

## Overview
This track adds the ability to search for patterns in the sidebar and create new patterns directly within the application.

## User Stories
- **Searchable Sidebar:** As a user, I want to type in a search box in the sidebar to quickly find a specific pattern by name.
- **Pattern Creation:** As a user, I want to click a button to create a new pattern, edit its "system prompt" (instructions), and save it so it appears in my library.

## Technical Requirements
- **Frontend:**
    -   Add a search input field to `Sidebar.tsx`.
    -   Implement client-side filtering of the `patterns` list based on the search input.
    -   Create a `PatternEditor` component (possibly a modal or a special view) to edit pattern names and content.
    -   Add a "Create Pattern" button in the Sidebar.
- **Backend:**
    -   Implement `POST /api/patterns` to save a new pattern to the local Fabric patterns directory (`~/.config/fabric/patterns/`).
    -   Ensure the backend handles directory creation and file writing safely.

## Success Criteria
- Typing in the sidebar search box filters the displayed patterns in real-time.
- Clicking "Create Pattern" opens an editor.
- Saving a pattern makes it appear in the sidebar list (after refresh or optimistic update).
- The new pattern can be dragged onto the canvas like any other pattern.
