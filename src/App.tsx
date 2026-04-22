import './index.css';
import { ReactFlowProvider } from '@xyflow/react';
import { Toolbar } from './components/Toolbar';
import { NodePalette } from './components/NodePalette';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { NodeFormPanel } from './components/NodeFormPanel';
import { SimulationPanel } from './components/SimulationPanel';

function App() {
  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
        <Toolbar />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          <NodePalette />
          <WorkflowCanvas />
          <NodeFormPanel />
          <SimulationPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
