import React, { useState } from 'react';
import { 
  Menu, Sparkles, User, FileDown, Trash2, Settings, 
  ExternalLink, CheckCircle2, AlertTriangle, Loader2 
} from 'lucide-react';
import { CANDIDATE_INFO } from '../data/candidateData';
import { downloadResume } from '../utils/downloadResume';

export const ChatHeader = ({ 
  onToggleSidebar, 
  onOpenProfile, 
  onOpenSettings, 
  onClearChat,
  backendConnected,
  hasMessages 
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadResume(false);
    setTimeout(() => setDownloading(false), 1200);
  };

  const handleView = () => {
    downloadResume(true);
  };
  return (
    <header className="chat-top-header">
      <div className="header-left">
        <button 
          className="header-icon-btn toggle-sidebar-btn" 
          onClick={onToggleSidebar}
          title="Toggle Navigation Sidebar"
          aria-label="Toggle navigation sidebar"
          type="button"
        >
          <Menu size={18} />
        </button>

        <div className="candidate-badge-wrapper">
          <div className="header-avatar-circle">SM</div>
          <div className="header-text-info">
            <div className="header-name-row">
              <span className="candidate-header-name">{CANDIDATE_INFO.name}</span>
              <span className="model-chip" title="Active LLM powering this assistant">
                <Sparkles size={11} />
                <span>gpt-oss-120b</span>
              </span>
            </div>
            <div className="header-role-sub">
              DevOps Engineer • TCS
            </div>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className={`connection-pill ${backendConnected ? 'conn-active' : 'conn-warn'}`}>
          <span className="status-dot" />
          <span className="status-text">
            {backendConnected ? 'AI System Connected' : 'Backend Disconnected'}
          </span>
        </div>
      </div>

      <div className="header-right">
        {hasMessages && (
          <button 
            className="header-action-btn" 
            onClick={onClearChat} 
            title="Clear current chat"
            type="button"
          >
            <Trash2 size={16} />
            <span className="btn-label-desktop">Clear</span>
          </button>
        )}

        <button 
          className="header-action-btn" 
          onClick={onOpenProfile} 
          title="View Sarthak's Complete Resume and Profile"
          type="button"
        >
          <User size={16} />
          <span className="btn-label-desktop">Profile</span>
        </button>

        <button 
          onClick={handleView}
          className="header-action-btn" 
          title="Open Sarthak Mehrotra's Resume PDF in a new tab"
          type="button"
        >
          <ExternalLink size={15} />
          <span className="btn-label-desktop">View PDF</span>
        </button>

        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="header-action-btn resume-download-cta" 
          title="Download Sarthak Mehrotra's Resume PDF to your Downloads folder"
          type="button"
        >
          {downloading ? <Loader2 size={16} className="spin" /> : <FileDown size={16} />}
          <span className="btn-label-desktop">{downloading ? 'Saving...' : 'Download'}</span>
        </button>

        <button 
          className="header-icon-btn" 
          onClick={onOpenSettings} 
          title="Configure API Endpoint"
          aria-label="Configure API endpoint"
          type="button"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
