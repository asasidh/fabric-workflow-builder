import { ReactFlow, Background, Controls } from '@xyflow/react';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content (Canvas) */}
      <main className="flex-1 relative bg-gray-50">
        <ReactFlow
          nodes={[]}
          edges={[]}
          fitView
        >
          <Background color="#ccc" variant={"dots" as any} />
          <Controls />
        </ReactFlow>
      </main>
    </div>
  );
}

export default App;
