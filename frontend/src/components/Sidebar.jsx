import React, { useState } from 'react';
import { 
  Plus, MessageSquare, ExternalLink, Mail, Code, 
  Settings, ChevronRight, FileText, CheckCircle2,
  Trash2, Sparkles, User, Briefcase
} from 'lucide-react';
import { CANDIDATE_INFO } from '../data/candidateData';
import { downloadResume } from '../utils/downloadResume';

export const Sidebar = ({ 
  isOpen, 
  onClose, 
  onNewChat, 
  onSelectPrompt, 
  onOpenProfile, 
  onOpenSettings,
  backendConnected,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession
}) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadResume(false);
    setTimeout(() => setDownloading(false), 1200);
  };

  const handlePreview = () => {
    downloadResume(true);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}

      <aside className={`chat-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top: New Chat button */}
        <div className="sidebar-top">
          <button className="new-chat-btn" onClick={onNewChat} type="button">
            <Plus size={18} />
            <span>New Interview Chat</span>
          </button>
        </div>

        {/* Candidate Profile Card */}
        <div className="candidate-sidebar-card">
          <div className="cand-header-row">
            <div className="cand-avatar">
              <span>SM</span>
              <span className="online-indicator" title="AI Proxy Online" />
            </div>
            <div className="cand-info">
              <div className="cand-name">{CANDIDATE_INFO.name}</div>
              <div className="cand-title">{CANDIDATE_INFO.title} • TCS</div>
            </div>
          </div>

          <div className="cand-actions">
            <button 
              className="cand-btn-profile" 
              onClick={onOpenProfile} 
              title="View Complete Profile & Verified Metrics"
              type="button"
            >
              <User size={13} />
              <span>Full Profile</span>
            </button>
            <a 
              href={CANDIDATE_INFO.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cand-social-btn" 
              title="LinkedIn Profile"
            >
              <ExternalLink size={13} />
            </a>
            <a 
              href={CANDIDATE_INFO.hashnode} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cand-social-btn" 
              title="Hashnode Tech Blog"
            >
              <Code size={13} />
            </a>
            <a 
              href={`mailto:${CANDIDATE_INFO.email}`} 
              className="cand-social-btn" 
              title="Email Sarthak"
            >
              <Mail size={13} />
            </a>
          </div>
        </div>

        {/* Middle Scrollable Section */}
        <div className="sidebar-scrollable">
          {/* Recent Conversations */}
          {sessions && sessions.length > 0 && (
            <div className="sidebar-section">
              <div className="section-title">
                <MessageSquare size={13} />
                <span>Chat History</span>
              </div>
              <div className="sessions-list">
                {sessions.map((sess) => (
                  <div 
                    key={sess.id} 
                    className={`session-item ${sess.id === currentSessionId ? 'active-session' : ''}`}
                    onClick={() => onSelectSession(sess.id)}
                  >
                    <MessageSquare size={14} className="session-icon" />
                    <span className="session-title" title={sess.title}>
                      {sess.title || 'Conversation'}
                    </span>
                    <button 
                      className="session-delete-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(sess.id);
                      }}
                      title="Delete chat"
                      type="button"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recruiter Quick Questions */}
          <div className="sidebar-section">
            <div className="section-title">
              <Sparkles size={13} />
              <span>Recruiter Question Vault</span>
            </div>

            {/* Category tabs */}
            <div className="vault-tabs">
              {CANDIDATE_INFO.suggestedQuestions.map((cat, i) => (
                <button
                  key={i}
                  className={`vault-tab-btn ${activeCategory === i ? 'active' : ''}`}
                  onClick={() => setActiveCategory(i)}
                  type="button"
                >
                  {cat.category.split(' ')[0]} {cat.category.split(' ')[1]}
                </button>
              ))}
            </div>

            <div className="vault-questions">
              {CANDIDATE_INFO.suggestedQuestions[activeCategory].questions.map((q, idx) => (
                <button
                  key={idx}
                  className="vault-q-btn"
                  onClick={() => onSelectPrompt(q)}
                  type="button"
                >
                  <ChevronRight size={13} className="q-arrow" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-bottom">
          <div className="sidebar-resume-group">
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="sidebar-link-btn"
              type="button"
              title="Download PDF to your Downloads folder"
            >
              <FileText size={15} />
              <span>{downloading ? 'Saving to Downloads...' : 'Download Resume (PDF)'}</span>
            </button>
            <button 
              onClick={handlePreview}
              className="sidebar-link-btn"
              type="button"
              title="Open Resume directly in browser tab"
            >
              <ExternalLink size={15} />
              <span>Open in New Tab</span>
            </button>
          </div>

          <button 
            className="sidebar-link-btn" 
            onClick={onOpenSettings} 
            type="button"
          >
            <Settings size={15} />
            <span>API Settings</span>
            <span 
              className={`status-pill ${backendConnected ? 'pill-connected' : 'pill-disconnected'}`}
              title={backendConnected ? 'Backend Connected' : 'Backend Offline - Click to configure'}
            >
              {backendConnected ? 'Connected' : 'Offline'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
