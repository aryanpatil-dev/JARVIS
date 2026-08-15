import { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Plus,
  Trash2,
  Bookmark,
  MessageSquare,
  Tag,
} from 'lucide-react';
import type { ProjectMemoryEntry, StoredSession, ChatMessage } from '../../types/electron';
import { soundEffects } from '../../services/sound.service';

export const MemoryPanel = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'sessions'>('knowledge');
  const [entries, setEntries] = useState<ProjectMemoryEntry[]>([]);
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'architecture' | 'task' | 'preference' | 'snippet'>('architecture');

  // Load memories
  const loadData = async () => {
    if (window.jarvisAPI?.memory) {
      try {
        const [memList, sessList] = await Promise.all([
          window.jarvisAPI.memory.getEntries(),
          window.jarvisAPI.memory.getSessions(),
        ]);
        setEntries(memList);
        setSessions(sessList);
      } catch (err) {
        console.error('Failed to load memory data:', err);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newContent.trim()) return;

    if (window.jarvisAPI?.memory) {
      await window.jarvisAPI.memory.saveEntry({
        workspaceId: 'Core',
        key: newKey.trim(),
        content: newContent.trim(),
        category: newCategory,
      });
      soundEffects.playConfirm();
      setNewKey('');
      setNewContent('');
      setIsAddingEntry(false);
      loadData();
    }
  };

  const handleDeleteEntry = async (id: string) => {
    soundEffects.playClick();
    if (window.jarvisAPI?.memory) {
      await window.jarvisAPI.memory.deleteEntry(id);
      loadData();
    }
  };

  const handleDeleteSession = async (id: string) => {
    soundEffects.playClick();
    if (window.jarvisAPI?.memory) {
      await window.jarvisAPI.memory.deleteSession(id);
      loadData();
    }
  };

  const filteredEntries = entries.filter(
    (e) =>
      e.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.messages.some((m: ChatMessage) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: '#0c0f17',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7' }}>
          <Database size={16} />
          <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            MEMORY & KNOWLEDGE VAULT
          </span>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('knowledge');
            }}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              backgroundColor: activeTab === 'knowledge' ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
              border: activeTab === 'knowledge' ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid transparent',
              color: activeTab === 'knowledge' ? '#c084fc' : '#94a3b8',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            Project Knowledge ({entries.length})
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('sessions');
            }}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              backgroundColor: activeTab === 'sessions' ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
              border: activeTab === 'sessions' ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid transparent',
              color: activeTab === 'sessions' ? '#c084fc' : '#94a3b8',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            Saved Conversations ({sessions.length})
          </button>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: '#0a0d14',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#07090e',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            padding: '6px 10px',
            flex: 1,
            maxWidth: '360px',
          }}
        >
          <Search size={13} color="#64748b" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory entries and past logs..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f8fafc',
              fontSize: '12px',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        {activeTab === 'knowledge' && (
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsAddingEntry(!isAddingEntry);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#121622',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#38bdf8',
              padding: '6px 12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={13} />
            <span>ADD KNOWLEDGE ENTRY</span>
          </button>
        )}
      </div>

      {/* Add Entry Form Drawer */}
      {isAddingEntry && (
        <form
          onSubmit={handleAddEntry}
          style={{
            padding: '12px 14px',
            backgroundColor: '#0c0f18',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '10px' }}>
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Key or Title (e.g. 'Project Architecture', 'DB Connection URL')..."
              style={{
                backgroundColor: '#07090e',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                padding: '8px 12px',
                color: '#f8fafc',
                fontSize: '12px',
                outline: 'none',
              }}
            />

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              style={{
                backgroundColor: '#07090e',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                color: '#cbd5e1',
                padding: '8px',
                fontSize: '12px',
                outline: 'none',
              }}
            >
              <option value="architecture">Architecture</option>
              <option value="task">Task / Goal</option>
              <option value="preference">Preference</option>
              <option value="snippet">Code Snippet</option>
            </select>
          </div>

          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Detailed memory content or context notes to be remembered by JARVIS across sessions..."
            rows={3}
            style={{
              backgroundColor: '#07090e',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '8px 12px',
              color: '#f8fafc',
              fontSize: '12px',
              outline: 'none',
              resize: 'vertical',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsAddingEntry(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#64748b',
                padding: '6px 12px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#38bdf8',
                border: 'none',
                borderRadius: '4px',
                color: '#08090b',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Save to Vault
            </button>
          </div>
        </form>
      )}

      {/* Main List Viewport */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {activeTab === 'knowledge' ? (
          filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  backgroundColor: '#0c0f17',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bookmark size={14} color="#38bdf8" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                      {entry.key}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(56, 189, 248, 0.12)',
                        color: '#38bdf8',
                        textTransform: 'uppercase',
                      }}
                    >
                      {entry.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      title="Delete Entry"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                  {entry.content}
                </p>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', gap: '8px' }}>
              <Tag size={24} />
              <span style={{ fontSize: '12px' }}>No project knowledge entries recorded yet.</span>
            </div>
          )
        ) : filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              style={{
                backgroundColor: '#0c0f17',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '6px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={16} color="#c084fc" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                    {session.title || 'Conversation Thread'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {session.messages.length} messages • Updated {new Date(session.updatedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  title="Delete Session"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', gap: '8px' }}>
            <MessageSquare size={24} />
            <span style={{ fontSize: '12px' }}>No saved conversations recorded.</span>
          </div>
        )}
      </div>
    </div>
  );
};
