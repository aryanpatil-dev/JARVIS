import { DockableLayout, ViewMode } from './DockableLayout';
import type { SystemMetrics } from '../../types/electron';

interface WorkspaceShellProps {
  metrics: SystemMetrics | null;
  securityMode: 'SAFE' | 'NORMAL' | 'POWER';
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isListening?: boolean;
}

export const WorkspaceShell = ({
  metrics,
  securityMode,
  onOpenCommandPalette,
  onOpenSettings,
  activeView,
  onViewChange,
  isListening = false,
}: WorkspaceShellProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        padding: '12px 16px',
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 10,
        height: 'calc(100vh - 44px - 72px)',
      }}
    >
      <DockableLayout
        metrics={metrics}
        securityMode={securityMode}
        activeView={activeView}
        onViewChange={onViewChange}
        onOpenCommandPalette={onOpenCommandPalette}
        onOpenSettings={onOpenSettings}
        isListening={isListening}
      />
    </div>
  );
};
