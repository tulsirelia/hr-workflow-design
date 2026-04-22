import { X, Plus, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import type { StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData, MetaField, WorkflowNodeData } from '../types/workflow';
import type { AutomationAction } from '../types/workflow';

export function NodeFormPanel() {
  const { nodes, selectedNodeId, selectNode, updateNodeData, automations } = useWorkflowStore();
  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;
  const data = node.data as WorkflowNodeData;

  return (
    <div className="slide-in" style={{ width: 280, background: 'var(--bg-panel)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Edit Node</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{data.label || 'Untitled'}</div>
        </div>
        <button className="btn-icon" onClick={() => selectNode(null)}><X size={14} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.type === 'start' && <StartForm data={data as StartNodeData} onChange={(d) => updateNodeData(node.id, d)} />}
        {data.type === 'task' && <TaskForm data={data as TaskNodeData} onChange={(d) => updateNodeData(node.id, d)} />}
        {data.type === 'approval' && <ApprovalForm data={data as ApprovalNodeData} onChange={(d) => updateNodeData(node.id, d)} />}
        {data.type === 'automated' && <AutomatedForm data={data as AutomatedNodeData} automations={automations} onChange={(d) => updateNodeData(node.id, d)} />}
        {data.type === 'end' && <EndForm data={data as EndNodeData} onChange={(d) => updateNodeData(node.id, d)} />}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="form-label">{label}</label>{children}</div>;
}

function MetaEditor({ fields, onChange }: { fields: MetaField[]; onChange: (f: MetaField[]) => void }) {
  const add = () => onChange([...fields, { key: '', value: '' }]);
  const remove = (i: number) => onChange(fields.filter((_, idx) => idx !== i));
  const update = (i: number, k: keyof MetaField, v: string) => {
    const next = [...fields]; next[i] = { ...next[i], [k]: v }; onChange(next);
  };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="form-label" style={{ margin: 0 }}>Custom Fields</span>
        <button className="btn-ghost" style={{ padding: '3px 8px', fontSize: 11 }} onClick={add}><Plus size={11} /> Add</button>
      </div>
      {fields.map((f, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <input className="form-input" style={{ flex: 1 }} placeholder="Key" value={f.key} onChange={(e) => update(i, 'key', e.target.value)} />
          <input className="form-input" style={{ flex: 1 }} placeholder="Value" value={f.value} onChange={(e) => update(i, 'value', e.target.value)} />
          <button className="btn-icon" style={{ padding: 5, flexShrink: 0 }} onClick={() => remove(i)}><Trash2 size={11} color="#ef4444" /></button>
        </div>
      ))}
      {fields.length === 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>No fields yet</div>}
    </div>
  );
}

function StartForm({ data, onChange }: { data: StartNodeData; onChange: (d: Partial<StartNodeData>) => void }) {
  return (
    <>
      <Field label="Start Title"><input className="form-input" value={data.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="e.g. Onboarding Start" /></Field>
      <MetaEditor fields={data.meta || []} onChange={(meta) => onChange({ meta })} />
    </>
  );
}

function TaskForm({ data, onChange }: { data: TaskNodeData; onChange: (d: Partial<TaskNodeData>) => void }) {
  return (
    <>
      <Field label="Title *"><input className="form-input" value={data.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Task title" /></Field>
      <Field label="Description"><textarea className="form-input" value={data.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Describe this task..." /></Field>
      <Field label="Assignee"><input className="form-input" value={data.assignee} onChange={(e) => onChange({ assignee: e.target.value })} placeholder="e.g. HR Team" /></Field>
      <Field label="Due Date"><input className="form-input" type="date" value={data.dueDate} onChange={(e) => onChange({ dueDate: e.target.value })} /></Field>
      <MetaEditor fields={data.customFields || []} onChange={(customFields) => onChange({ customFields })} />
    </>
  );
}

function ApprovalForm({ data, onChange }: { data: ApprovalNodeData; onChange: (d: Partial<ApprovalNodeData>) => void }) {
  return (
    <>
      <Field label="Title"><input className="form-input" value={data.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Approval step name" /></Field>
      <Field label="Approver Role">
        <select className="form-input" value={data.approverRole} onChange={(e) => onChange({ approverRole: e.target.value })}>
          <option value="">Select role...</option>
          {['Manager','HRBP','Director','VP','CEO'].map(r => <option key={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="Auto-Approve Threshold">
        <input className="form-input" type="number" min={0} value={data.autoApproveThreshold} onChange={(e) => onChange({ autoApproveThreshold: Number(e.target.value) })} placeholder="0 = manual only" />
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Set &gt; 0 to enable auto-approval</div>
      </Field>
    </>
  );
}

function AutomatedForm({ data, automations, onChange }: { data: AutomatedNodeData; automations: AutomationAction[]; onChange: (d: Partial<AutomatedNodeData>) => void }) {
  const selectedAction = automations.find((a) => a.id === data.actionId);
  const handleActionChange = (actionId: string) => {
    const action = automations.find((a) => a.id === actionId);
    const actionParams: Record<string, string> = {};
    if (action) for (const p of action.params) actionParams[p] = data.actionParams?.[p] || '';
    onChange({ actionId, actionParams });
  };
  return (
    <>
      <Field label="Title"><input className="form-input" value={data.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Step name" /></Field>
      <Field label="Action">
        <select className="form-input" value={data.actionId || ''} onChange={(e) => handleActionChange(e.target.value)}>
          <option value="">Select an action...</option>
          {automations.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </Field>
      {selectedAction && selectedAction.params.length > 0 && (
        <div>
          <label className="form-label">Action Parameters</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selectedAction.params.map((p) => (
              <div key={p}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, display: 'block' }}>{p}</label>
                <input className="form-input" placeholder={`Enter ${p}...`} value={data.actionParams?.[p] || ''} onChange={(e) => onChange({ actionParams: { ...data.actionParams, [p]: e.target.value } })} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function EndForm({ data, onChange }: { data: EndNodeData; onChange: (d: Partial<EndNodeData>) => void }) {
  return (
    <>
      <Field label="Title"><input className="form-input" value={data.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="End step name" /></Field>
      <Field label="End Message"><textarea className="form-input" value={data.endMessage} onChange={(e) => onChange({ endMessage: e.target.value })} placeholder="Completion message..." /></Field>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Generate Summary</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Show completion report</div>
        </div>
        <label className="toggle-switch">
          <input type="checkbox" checked={data.showSummary} onChange={(e) => onChange({ showSummary: e.target.checked })} />
          <div className="toggle-track" />
        </label>
      </div>
    </>
  );
}
