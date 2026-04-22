export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface MetaField { key: string; value: string; }

export interface StartNodeData extends Record<string, unknown> {
  type: 'start';
  label: string;
  meta: MetaField[];
}

export interface TaskNodeData extends Record<string, unknown> {
  type: 'task';
  label: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: MetaField[];
}

export interface ApprovalNodeData extends Record<string, unknown> {
  type: 'approval';
  label: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData extends Record<string, unknown> {
  type: 'automated';
  label: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData extends Record<string, unknown> {
  type: 'end';
  label: string;
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulateResult {
  steps: SimStep[];
  success: boolean;
  error?: string;
}

export interface SimStep {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}
