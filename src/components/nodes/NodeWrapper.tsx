import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Trash2 } from 'lucide-react';

interface NodeWrapperProps {
  id: string;
  color: string;
  icon: React.ReactNode;
  label: string;
  badge: string;
  children?: React.ReactNode;
  hasTarget?: boolean;
  hasSource?: boolean;
}

export function NodeWrapper({ id, color, icon, label, badge, children, hasTarget = true, hasSource = true }: NodeWrapperProps) {
  const { selectNode, selectedNodeId, deleteNode } = useWorkflowStore();
  const isSelected = selectedNodeId === id;

  return (
    <div
      className="workflow-node"
      style={{
        borderColor: isSelected ? color : undefined,
        boxShadow: isSelected ? `0 0 0 2px ${color}40, 0 8px 30px ${color}20` : undefined,
      }}
      onClick={(e) => { e.stopPropagation(); selectNode(id); }}
    >
      {hasTarget && <Handle type="target" position={Position.Top} />}

      {/* Node Header */}
      <div
        style={{ background: `${color}18`, borderBottom: `1px solid ${color}30` }}
        className="flex items-center justify-between px-3 py-2 rounded-t-xl"
      >
        <div className="flex items-center gap-2">
          <div
            style={{ background: `${color}25`, color }}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            {icon}
          </div>
          <div>
            <div style={{ color, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {badge}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf0', lineHeight: 1.2 }}>
              {label || 'Untitled'}
            </div>
          </div>
        </div>
        <button
          className="btn-icon"
          style={{ padding: 4, opacity: 0, pointerEvents: isSelected ? 'auto' : 'none' }}
          onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
          title="Delete node"
        >
          <Trash2 size={12} color="#ef4444" />
        </button>
      </div>

      {/* Node Body */}
      {children && (
        <div className="px-3 py-2">
          {children}
        </div>
      )}

      {hasSource && <Handle type="source" position={Position.Bottom} />}
    </div>
  );
}
