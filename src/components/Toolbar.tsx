import { useState, useRef } from 'react';
import { Play, Download, Upload, Trash2, GitBranch, Edit2, Check } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';

export function Toolbar() {
  const { workflowName, setWorkflowName, runSimulation, simLoading, exportWorkflow, importWorkflow, clearWorkflow, nodes, edges } = useWorkflowStore();
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(workflowName);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => importWorkflow(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  const saveTitle = () => {
    setWorkflowName(tempName || 'Untitled Workflow');
    setEditing(false);
  };

  return (
    <div style={{
      height: 56,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 10,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
        <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GitBranch size={15} color="white" />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>FlowForge</span>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

      {/* Editable workflow name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {editing ? (
          <>
            <input
              className="form-input"
              style={{ width: 220, height: 32, padding: '4px 10px' }}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
              autoFocus
            />
            <button className="btn-icon" onClick={saveTitle}><Check size={13} color="#22c55e" /></button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{workflowName}</span>
            <button className="btn-icon" onClick={() => { setTempName(workflowName); setEditing(true); }}>
              <Edit2 size={12} />
            </button>
          </>
        )}
      </div>

      {/* Node/edge counts */}
      <div style={{ display: 'flex', gap: 8, marginLeft: 4 }}>
        <span style={{ fontSize: 11, background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '3px 9px', borderRadius: 20, color: 'var(--text-muted)' }}>
          {nodes.length} nodes
        </span>
        <span style={{ fontSize: 11, background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '3px 9px', borderRadius: 20, color: 'var(--text-muted)' }}>
          {edges.length} edges
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-ghost" style={{ fontSize: 12 }} onClick={handleExport} title="Export workflow JSON">
          <Download size={13} /> Export
        </button>

        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => fileRef.current?.click()} title="Import workflow JSON">
          <Upload size={13} /> Import
        </button>

        <button className="btn-ghost" style={{ fontSize: 12, color: '#ef4444' }} onClick={() => { if (confirm('Clear all nodes?')) clearWorkflow(); }} title="Clear canvas">
          <Trash2 size={13} /> Clear
        </button>

        <button className="btn-primary" onClick={runSimulation} disabled={simLoading}>
          {simLoading ? <span className="spinner" style={{ width: 13, height: 13 }} /> : <Play size={13} />}
          {simLoading ? 'Running...' : 'Simulate'}
        </button>
      </div>
    </div>
  );
}
