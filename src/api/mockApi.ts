import type { AutomationAction, SimulateResult, SimStep, WorkflowNodeData, NodeType } from '../types/workflow';
import type { Node, Edge } from '@xyflow/react';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300);
  return [
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
    { id: 'send_slack', label: 'Send Slack Message', params: ['channel', 'message'] },
    { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
    { id: 'create_jira', label: 'Create Jira Ticket', params: ['project', 'summary', 'assignee'] },
    { id: 'send_sms', label: 'Send SMS Alert', params: ['phone', 'message'] },
  ];
}

function topologicalSort(nodes: Node<WorkflowNodeData>[], edges: Edge[]): Node<WorkflowNodeData>[] | null {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};
  for (const n of nodes) { inDegree[n.id] = 0; adj[n.id] = []; }
  for (const e of edges) {
    if (adj[e.source]) adj[e.source].push(e.target);
    if (e.target in inDegree) inDegree[e.target]++;
  }
  const queue = nodes.filter((n) => inDegree[n.id] === 0);
  const result: Node<WorkflowNodeData>[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of adj[node.id] || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        const found = nodes.find((n) => n.id === neighbor);
        if (found) queue.push(found);
      }
    }
  }
  return result.length === nodes.length ? result : null;
}

export async function simulateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Promise<SimulateResult> {
  await delay(600);
  const steps: SimStep[] = [];
  const now = new Date();

  const startNodes = nodes.filter((n) => n.data.type === 'start');
  const endNodes = nodes.filter((n) => n.data.type === 'end');

  if (startNodes.length === 0) return { steps, success: false, error: 'Workflow must have exactly one Start node.' };
  if (startNodes.length > 1) return { steps, success: false, error: 'Workflow has multiple Start nodes. Only one allowed.' };
  if (endNodes.length === 0) return { steps, success: false, error: 'Workflow must have at least one End node.' };

  const connectedIds = new Set<string>();
  connectedIds.add(startNodes[0].id);
  for (const e of edges) { connectedIds.add(e.source); connectedIds.add(e.target); }
  const disconnected = nodes.filter((n) => !connectedIds.has(n.id));
  if (disconnected.length > 0) {
    return { steps, success: false, error: `Disconnected nodes: ${disconnected.map(n => n.data.label).join(', ')}` };
  }

  const sorted = topologicalSort(nodes, edges);
  if (!sorted) return { steps, success: false, error: 'Cycle detected in workflow. Workflows must be acyclic.' };

  for (let i = 0; i < sorted.length; i++) {
    const node = sorted[i];
    const data = node.data;
    const t = new Date(now.getTime() + i * 1200);
    const timestamp = t.toLocaleTimeString();
    let message = '';
    let status: SimStep['status'] = 'success';

    switch (data.type) {
      case 'start':
        message = `Workflow "${data.label}" initialized. Entry point established.`;
        status = 'info';
        break;
      case 'task': {
        const td = data as import('../types/workflow').TaskNodeData;
        message = `Task "${td.label}" assigned to ${td.assignee || 'Unassigned'}. ${td.dueDate ? `Due: ${td.dueDate}.` : ''} Awaiting completion.`;
        status = td.assignee ? 'success' : 'warning';
        break;
      }
      case 'approval': {
        const ad = data as import('../types/workflow').ApprovalNodeData;
        message = ad.autoApproveThreshold > 0
          ? `Approval "${ad.label}" — auto-approve threshold: ${ad.autoApproveThreshold}. Routed to ${ad.approverRole || 'Manager'}.`
          : `Approval "${ad.label}" pending ${ad.approverRole || 'Manager'} review.`;
        break;
      }
      case 'automated': {
        const aud = data as import('../types/workflow').AutomatedNodeData;
        const paramStr = Object.entries(aud.actionParams || {}).filter(([,v]) => v).map(([k,v]) => `${k}="${v}"`).join(', ');
        message = `Action "${aud.label}" triggered${aud.actionId ? ` — ${aud.actionId}` : ''}. ${paramStr || 'No params configured.'}`;
        status = aud.actionId ? 'success' : 'warning';
        break;
      }
      case 'end': {
        const ed = data as import('../types/workflow').EndNodeData;
        message = `Workflow completed. ${ed.endMessage || 'All steps processed.'} ${ed.showSummary ? 'Summary report generated.' : ''}`;
        break;
      }
    }

    steps.push({ nodeId: node.id, nodeType: data.type as NodeType, label: data.label, status, message, timestamp });
  }

  return { steps, success: true };
}
