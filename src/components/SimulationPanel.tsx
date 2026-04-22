import { X, Play, CheckCircle, AlertTriangle, XCircle, Info, AlertCircle } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import type { SimStep } from '../types/workflow';

const STATUS_CONFIG = {
  success: { color: '#22c55e', icon: <CheckCircle size={14} /> },
  warning: { color: '#eab308', icon: <AlertTriangle size={14} /> },
  error:   { color: '#ef4444', icon: <XCircle size={14} /> },
  info:    { color: '#3b82f6', icon: <Info size={14} /> },
};

const NODE_TYPE_COLOR: Record<string, string> = {
  start: '#22c55e',
  task: '#3b82f6',
  approval: '#a855f7',
  automated: '#f97316',
  end: '#ef4444',
};

export function SimulationPanel() {
  const { simOpen, simLoading, simResult, setSimOpen, runSimulation } = useWorkflowStore();

  if (!simOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={() => setSimOpen(false)}
    >
      <div
        className="fade-in"
        style={{
          width: 560,
          maxHeight: '80vh',
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Workflow Simulation</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Step-by-step execution trace</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={runSimulation} disabled={simLoading} style={{ fontSize: 12 }}>
              <Play size={13} /> Re-run
            </button>
            <button className="btn-icon" onClick={() => setSimOpen(false)}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {simLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 }}>
              <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Simulating workflow execution...</div>
            </div>
          ) : simResult?.error ? (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Validation Error</div>
                <div style={{ fontSize: 13, color: '#fca5a5' }}>{simResult.error}</div>
              </div>
            </div>
          ) : simResult?.steps ? (
            <>
              {/* Summary bar */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, padding: 12, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{simResult.steps.length}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Steps</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>{simResult.steps.filter(s => s.status === 'success').length}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Passed</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#eab308' }}>{simResult.steps.filter(s => s.status === 'warning').length}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Warnings</div>
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Vertical line */}
                <div style={{ position: 'absolute', left: 11, top: 8, bottom: 8, width: 1, background: 'var(--border)', zIndex: 0 }} />

                {simResult.steps.map((step, i) => (
                  <StepRow key={step.nodeId} step={step} index={i} />
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              No simulation data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepRow({ step, index }: { step: SimStep; index: number }) {
  const cfg = STATUS_CONFIG[step.status];
  const nodeColor = NODE_TYPE_COLOR[step.nodeType] || '#8b93a8';

  return (
    <div
      className="log-step"
      style={{
        animationDelay: `${index * 80}ms`,
        opacity: 0,
        animationFillMode: 'forwards',
        position: 'relative',
        paddingLeft: 28,
      }}
    >
      {/* Dot */}
      <div style={{
        position: 'absolute',
        left: 6,
        top: 14,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: cfg.color,
        border: `2px solid var(--bg-panel)`,
        zIndex: 1,
        boxShadow: `0 0 8px ${cfg.color}60`,
      }} />

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, display: 'flex', alignItems: 'center', gap: 4 }}>
            {cfg.icon} {step.label}
          </span>
          <span style={{ fontSize: 10, background: `${nodeColor}20`, color: nodeColor, padding: '1px 7px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {step.nodeType}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{step.timestamp}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.message}</div>
      </div>
    </div>
  );
}
