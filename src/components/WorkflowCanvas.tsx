import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '../store/workflowStore';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from './nodes/CustomNodes';
import type { WorkflowNodeData, StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../types/workflow';

const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};

function makeDefaultData(dataType: string, label: string): WorkflowNodeData {
  switch (dataType) {
    case 'start': return { type: 'start', label, meta: [] } as StartNodeData;
    case 'task': return { type: 'task', label, description: '', assignee: '', dueDate: '', customFields: [] } as TaskNodeData;
    case 'approval': return { type: 'approval', label, approverRole: 'Manager', autoApproveThreshold: 0 } as ApprovalNodeData;
    case 'automated': return { type: 'automated', label, actionId: '', actionParams: {} } as AutomatedNodeData;
    case 'end': return { type: 'end', label, endMessage: '', showSummary: false } as EndNodeData;
    default: return { type: 'start', label, meta: [] } as StartNodeData;
  }
}

function CanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, selectNode, loadAutomations } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => { loadAutomations(); }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('application/reactflow-type');
    const dataType = e.dataTransfer.getData('application/reactflow-datatype');
    if (!nodeType) return;

    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const id = `${nodeType}-${Date.now()}`;
    const labelMap: Record<string, string> = { start: 'Start', task: 'New Task', approval: 'Approval Step', automated: 'Automated Step', end: 'End' };

    const newNode: Node<WorkflowNodeData> = {
      id,
      type: nodeType,
      position,
      data: makeDefaultData(dataType, labelMap[dataType] || 'Node'),
    };
    addNode(newNode);
    selectNode(id);
  }, [screenToFlowPosition, addNode, selectNode]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    selectNode(node.id);
  }, [selectNode]);

  const onPaneClick = useCallback(() => { selectNode(null); }, [selectNode]);

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
        style={{ background: 'var(--bg-primary)' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1a1d27" />
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-left"
          nodeColor={(node) => {
            const type = (node.data as WorkflowNodeData)?.type;
            const colors: Record<string, string> = { start: '#22c55e', task: '#3b82f6', approval: '#a855f7', automated: '#f97316', end: '#ef4444' };
            return colors[type] || '#333850';
          }}
          maskColor="rgba(13,15,20,0.7)"
        />
      </ReactFlow>

      {nodes.length === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 12 }}>
          <div style={{ fontSize: 40, opacity: 0.3 }}>⬡</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-muted)' }}>Drop nodes here to start</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', opacity: 0.7 }}>Drag from the left panel onto the canvas</div>
        </div>
      )}
    </div>
  );
}

export function WorkflowCanvas() {
  return <CanvasInner />;
}
