# Technology Stack

## Frontend
- **Framework:** React with TypeScript (via Vite for fast development).
- **Workflow Engine:** React Flow for the visual drag-and-drop canvas and node management.
- **Styling:** Tailwind CSS for a modern, utility-first approach to UI development.
- **Animations:** Framer Motion to implement the playful micro-animations (bounces, shakes) and smooth transitions.
- **State Management:** React Context or Zustand for managing workflow state and node data.

## Backend (Initial Implementation)
- **Runtime:** Node.js with TypeScript.
- **Framework:** Express.js to create a lightweight local API.
- **Integration:** Child Process execution to interact with the local `fabric` CLI or direct API integrations for execution logic.

## Future Considerations
- **Client-Side Mode:** An option to run the application entirely in-browser, calling LLM APIs directly via proxy or CORS-enabled endpoints.
