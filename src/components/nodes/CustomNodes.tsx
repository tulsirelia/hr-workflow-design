import type { NodeProps } from '@xyflow/react';
import { Play, CheckSquare, ShieldCheck, Zap, Flag } from 'lucide-react';
import { NodeWrapper } from './NodeWrapper';
import type { StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../../types/workflow';

export function StartNode({ id, data }: NodeProps) {
  const d = data as unknown as StartNodeData;
  return (
    <NodeWrapper id={id} color="#22c55e" badge="Start" label={d.label} icon={<Play size={14} />} hasTarget={false}>
      {d.meta && d.meta.length > 0 && (
        <div style={{ fontSize: 11, color: '#8b93a8' }}>
          {d.meta.filter(m => m.key).map((m, i) => (
            <div key={i}>{m.key}: <span style={{ color: '#e8eaf0' }}>{m.value}</span></div>
          ))}
        </div>
      )}
    </NodeWrapper>
  );
}

export function TaskNode({ id, data }: NodeProps) {
  const d = data as unknown as TaskNodeData;
  return (
    <NodeWrapper id={id} color="#3b82f6" badge="Task" label={d.label} icon={<CheckSquare size={14} />}>
      <div style={{ fontSize: 11, color: '#8b93a8', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {d.assignee && <div><span style={{ color: '#555e78' }}>Assignee: </span><span style={{ color: '#e8eaf0' }}>{d.assignee}</span></div>}
        {d.dueDate && <div><span style={{ color: '#555e78' }}>Due: </span><span style={{ color: '#e8eaf0' }}>{d.dueDate}</span></div>}
        {d.description && <div style={{ color: '#555e78', fontSize: 10, marginTop: 2 }}>{d.description.slice(0, 45)}{d.description.length > 45 ? '…' : ''}</div>}
      </div>
    </NodeWrapper>
  );
}

export function ApprovalNode({ id, data }: NodeProps) {
  const d = data as unknown as ApprovalNodeData;
  return (
    <NodeWrapper id={id} color="#a855f7" badge="Approval" label={d.label} icon={<ShieldCheck size={14} />}>
      <div style={{ fontSize: 11, color: '#8b93a8', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {d.approverRole && <div><span style={{ color: '#555e78' }}>Approver: </span><span style={{ color: '#e8eaf0' }}>{d.approverRole}</span></div>}
        {d.autoApproveThreshold > 0 && <div><span style={{ color: '#555e78' }}>Auto-approve: </span><span style={{ color: '#eab308' }}>{d.autoApproveThreshold}</span></div>}
      </div>
    </NodeWrapper>
  );
}

export function AutomatedNode({ id, data }: NodeProps) {
  const d = data as unknown as AutomatedNodeData;
  return (
    <NodeWrapper id={id} color="#f97316" badge="Automated" label={d.label} icon={<Zap size={14} />}>
      {d.actionId && <div style={{ fontSize: 11 }}><span style={{ color: '#555e78' }}>Action: </span><span style={{ color: '#f97316', fontWeight: 600 }}>{d.actionId}</span></div>}
    </NodeWrapper>
  );
}

export function EndNode({ id, data }: NodeProps) {
  const d = data as unknown as EndNodeData;
  return (
    <NodeWrapper id={id} color="#ef4444" badge="End" label={d.label} icon={<Flag size={14} />} hasSource={false}>
      {d.endMessage && <div style={{ fontSize: 11, color: '#8b93a8' }}>{d.endMessage.slice(0, 50)}{d.endMessage.length > 50 ? '…' : ''}</div>}
    </NodeWrapper>
  );
}
