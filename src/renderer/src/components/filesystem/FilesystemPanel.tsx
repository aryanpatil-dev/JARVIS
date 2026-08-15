import { useState, useEffect, useCallback } from 'react';
import {
  Folder,
  File,
  FileCode,
  FileText,
  HardDrive,
  Home,
  ChevronRight,
  ArrowUp,
  RefreshCw,
  Search,
  Eye,
  X,
} from 'lucide-react';
import type { FileItem } from '../../types/electron';

export const FilesystemPanel = () => {
  const [currentPath, setCurrentPath] = useState('');
  const [roots, setRoots] = useState<{ name: string; path: string }[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load roots initially
  useEffect(() => {
    const loadRoots = async () => {
      if (window.jarvisAPI?.fs) {
        try {
          const driveRoots = await window.jarvisAPI.fs.getRoots();
          setRoots(driveRoots);
          if (driveRoots.length > 0) {
            setCurrentPath(driveRoots[0].path);
          }
        } catch (err) {
          console.error('Failed to load filesystem roots:', err);
        }
      }
    };
    loadRoots();
  }, []);

  // Load directory contents
  const loadDirectory = useCallback(async (dirPath: string) => {
    if (!window.jarvisAPI?.fs || !dirPath) return;

    setIsLoading(true);
    try {
      const items = await window.jarvisAPI.fs.readDir(dirPath);
      setFiles(items);
      setCurrentPath(dirPath);
    } catch (err) {
      console.error(`Failed to read directory ${dirPath}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentPath) {
      loadDirectory(currentPath);
    }
  }, [currentPath, loadDirectory]);

  // Navigate Up
  const handleNavigateUp = () => {
    if (!currentPath) return;
    const parts = currentPath.replace(/\\$/, '').split('\\');
    if (parts.length > 1) {
      parts.pop();
      const parentPath = parts.join('\\') + (parts.length === 1 ? '\\' : '');
      loadDirectory(parentPath);
    }
  };

  // Open file or directory
  const handleItemClick = async (item: FileItem) => {
    if (item.isDir) {
      loadDirectory(item.path);
    } else {
      // Preview text/code files
      try {
        const res = await window.jarvisAPI.fs.readFile(item.path);
        setSelectedFile({
          path: item.path,
          name: item.name,
          content: res.content,
        });
      } catch (err) {
        console.error('Error opening file:', err);
      }
    }
  };

  const getFileIcon = (item: FileItem) => {
    if (item.isDir) return <Folder size={14} color="#38bdf8" />;
    const ext = item.extension;
    if (['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.py', '.rs', '.go'].includes(ext || '')) {
      return <FileCode size={14} color="#10b981" />;
    }
    if (['.md', '.txt', '.log', '.env'].includes(ext || '')) {
      return <FileText size={14} color="#f59e0b" />;
    }
    return <File size={14} color="#94a3b8" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '--';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#07090e',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        overflow: 'hidden',
      }}
    >
      {/* Navigation Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0c0f17',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        {/* Roots Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            overflowX: 'auto',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          {roots.map((root) => {
            const isSelected = currentPath.startsWith(root.path);
            return (
              <button
                key={root.name}
                onClick={() => loadDirectory(root.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#121622',
                  border: isSelected ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: isSelected ? '#38bdf8' : '#94a3b8',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {root.name.includes('Disk') ? <HardDrive size={11} /> : <Home size={11} />}
                <span>{root.name}</span>
              </button>
            );
          })}
        </div>

        {/* Path Breadcrumbs & Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, overflow: 'hidden' }}>
            <button
              onClick={handleNavigateUp}
              title="Up Directory"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 6px',
                borderRadius: '4px',
                background: '#121622',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <ArrowUp size={12} />
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#cbd5e1',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <ChevronRight size={12} color="#64748b" />
              <span>{currentPath}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#121622',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                padding: '3px 8px',
              }}
            >
              <Search size={12} color="#64748b" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter files..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '11px',
                  fontFamily: 'var(--font-sans)',
                  width: '100px',
                }}
              />
            </div>

            <button
              onClick={() => loadDirectory(currentPath)}
              title="Refresh"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Filesystem Split (Directory Tree + File Preview) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* File List Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
          {isLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
              Scanning directory...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
              Empty directory.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: '10px', textAlign: 'left' }}>
                  <th style={{ padding: '6px 8px' }}>NAME</th>
                  <th style={{ padding: '6px 8px', width: '90px' }}>SIZE</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.path}
                    onClick={() => handleItemClick(file)}
                    style={{
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getFileIcon(file)}
                      <span style={{ color: file.isDir ? '#f8fafc' : '#cbd5e1', fontWeight: file.isDir ? 500 : 400 }}>
                        {file.name}
                      </span>
                    </td>
                    <td style={{ padding: '6px 8px', color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      {formatSize(file.size)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* File Preview Drawer */}
        {selectedFile && (
          <div
            style={{
              width: '45%',
              borderLeft: '1px solid rgba(255, 255, 255, 0.07)',
              backgroundColor: '#0a0d14',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: '#0f131d',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                <Eye size={12} color="#38bdf8" />
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: '#f8fafc',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedFile.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={12} />
              </button>
            </div>
            <pre
              style={{
                flex: 1,
                padding: '10px',
                margin: 0,
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#cbd5e1',
                lineHeight: '1.4',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {selectedFile.content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
