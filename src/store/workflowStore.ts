import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type { WorkflowNodeData, AutomationAction, SimulateResult } from '../types/workflow';
import { getAutomations, simulateWorkflow } from '../api/mockApi';

type WFNode = Node<WorkflowNodeData>;

interface WorkflowStore {
  nodes: WFNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  automations: AutomationAction[];
  simResult: SimulateResult | null;
  simOpen: boolean;
  simLoading: boolean;
  workflowName: string;

  setWorkflowName: (name: string) => void;
  onNodesChange: (changes: NodeChange<WFNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: WFNode) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  loadAutomations: () => Promise<void>;
  runSimulation: () => Promise<void>;
  setSimOpen: (open: boolean) => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
  clearWorkflow: () => void;
}

const defaultNodes: WFNode[] = [
  { id: 'start-1', type: 'startNode', position: { x: 320, y: 60 },
    data: { type: 'start', label: 'Onboarding Start', meta: [] } },
  { id: 'task-1', type: 'taskNode', position: { x: 280, y: 200 },
    data: { type: 'task', label: 'Collect Documents', description: 'Gather required onboarding docs', assignee: 'HR Team', dueDate: '2025-08-01', customFields: [] } },
  { id: 'approval-1', type: 'approvalNode', position: { x: 280, y: 360 },
    data: { type: 'approval', label: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 0 } },
  { id: 'auto-1', type: 'automatedNode', position: { x: 280, y: 520 },
    data: { type: 'automated', label: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'employee@company.com', subject: 'Welcome!', body: 'Welcome to the team!' } } },
  { id: 'end-1', type: 'endNode', position: { x: 320, y: 680 },
    data: { type: 'end', label: 'Onboarding Complete', endMessage: 'Employee onboarding completed successfully.', showSummary: true } },
];

const defaultEdges: Edge[] = [
  { id: 'e1', source: 'start-1', target: 'task-1', type: 'smoothstep' },
  { id: 'e2', source: 'task-1', target: 'approval-1', type: 'smoothstep' },
  { id: 'e3', source: 'approval-1', target: 'auto-1', type: 'smoothstep' },
  { id: 'e4', source: 'auto-1', target: 'end-1', type: 'smoothstep' },
];

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: defaultNodes,
  edges: defaultEdges,
  selectedNodeId: null,
  automations: [],
  simResult: null,
  simOpen: false,
  simLoading: false,
  workflowName: 'Employee Onboarding',

  setWorkflowName: (name) => set({ workflowName: name }),

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => ({ edges: addEdge({ ...connection, type: 'smoothstep' }, state.edges) })),

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  selectNode: (id) => set({ selectedNodeId: id }),

  loadAutomations: async () => {
    const automations = await getAutomations();
    set({ automations });
  },

  runSimulation: async () => {
    set({ simLoading: true, simOpen: true, simResult: null });
    const { nodes, edges } = get();
    const result = await simulateWorkflow(nodes, edges);
    set({ simResult: result, simLoading: false });
  },

  setSimOpen: (open) => set({ simOpen: open }),

  exportWorkflow: () => {
    const { nodes, edges, workflowName } = get();
    return JSON.stringify({ workflowName, nodes, edges }, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const { workflowName, nodes, edges } = JSON.parse(json);
      set({ workflowName, nodes, edges, selectedNodeId: null });
    } catch {
      alert('Invalid workflow JSON');
    }
  },

  clearWorkflow: () => set({ nodes: [], edges: [], selectedNodeId: null }),
}));
