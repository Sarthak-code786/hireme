import React, { useState } from 'react';
import { marked } from 'marked';
import { Copy, Check, Bot, User, Sparkles } from 'lucide-react';

marked.setOptions({
  breaks: true,
  gfm: true,
});

export const ChatMessage = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    if (!isAssistant) {
      return <div className="user-message-text">{message.content}</div>;
    }

    const htmlContent = marked.parse(message.content || '');
    return (
      <div 
        className="markdown-body" 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    );
  };

  return (
    <div className={`message-row ${isAssistant ? 'assistant-row' : 'user-row'} animate-fade-in`}>
      <div className="message-container">
        <div className={`avatar ${isAssistant ? 'assistant-avatar' : 'user-avatar'}`}>
          {isAssistant ? <Sparkles size={18} /> : <User size={18} />}
        </div>

        <div className="message-content-wrapper">
          <div className="message-header">
            <span className="sender-name">
              {isAssistant ? 'Sarthak AI (Candidate Proxy)' : 'You (Recruiter)'}
            </span>
            <span className="message-time">
              {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="message-body">
            {renderContent()}
          </div>

          {isAssistant && message.content && (
            <div className="message-actions">
              <button 
                className="action-btn" 
                onClick={handleCopy} 
                title="Copy response to clipboard"
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
