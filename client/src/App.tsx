import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content (Canvas) */}
      <Canvas />
    </div>
  );
}

export default App;