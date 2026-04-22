import { Play, CheckSquare, ShieldCheck, Zap, Flag, GripVertical } from 'lucide-react';

const NODE_TYPES = [
  { type: 'startNode', dataType: 'start', label: 'Start Node', icon: <Play size={14} />, color: '#22c55e', desc: 'Workflow entry point' },
  { type: 'taskNode', dataType: 'task', label: 'Task Node', icon: <CheckSquare size={14} />, color: '#3b82f6', desc: 'Human task or action' },
  { type: 'approvalNode', dataType: 'approval', label: 'Approval Node', icon: <ShieldCheck size={14} />, color: '#a855f7', desc: 'Manager or HR approval' },
  { type: 'automatedNode', dataType: 'automated', label: 'Automated Step', icon: <Zap size={14} />, color: '#f97316', desc: 'System-triggered action' },
  { type: 'endNode', dataType: 'end', label: 'End Node', icon: <Flag size={14} />, color: '#ef4444', desc: 'Workflow completion' },
];

export function NodePalette() {
  const onDragStart = (e: React.DragEvent, nodeType: string, dataType: string) => {
    e.dataTransfer.setData('application/reactflow-type', nodeType);
    e.dataTransfer.setData('application/reactflow-datatype', dataType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      style={{
        width: 220,
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          Node Palette
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Drag nodes to canvas
        </div>
      </div>

      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto' }}>
        {NODE_TYPES.map((nt) => (
          <div
            key={nt.type}
            className="node-palette-item"
            draggable
            onDragStart={(e) => onDragStart(e, nt.type, nt.dataType)}
          >
            <div
              style={{ background: `${nt.color}20`, color: nt.color, width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              {nt.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{nt.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{nt.desc}</div>
            </div>
            <GripVertical size={13} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.5 }} />
          </div>
        ))}
      </div>

      {/* Keyboard hints */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <div><span style={{ fontFamily: 'monospace', background: 'var(--bg-card)', padding: '1px 5px', borderRadius: 3 }}>Del</span> Delete selected</div>
          <div><span style={{ fontFamily: 'monospace', background: 'var(--bg-card)', padding: '1px 5px', borderRadius: 3 }}>Ctrl+Z</span> Undo</div>
          <div><span style={{ fontFamily: 'monospace', background: 'var(--bg-card)', padding: '1px 5px', borderRadius: 3 }}>Scroll</span> Zoom</div>
        </div>
      </div>
    </div>
  );
}
