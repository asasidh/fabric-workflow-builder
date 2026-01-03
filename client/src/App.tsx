import { ReactFlow, Background, Controls } from '@xyflow/react';

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Fabric Patterns</h2>
        <div className="space-y-2">
          {/* Pattern items will go here */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-colors">
            Summarize
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-green-100 transition-colors">
            Extract Wisdom
          </div>
        </div>
      </aside>

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