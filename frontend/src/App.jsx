import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  ArrowUp, Sparkles, AlertCircle, RefreshCw, 
  RotateCcw, Info, CheckCircle2 
} from 'lucide-react';

import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { PromptCards } from './components/PromptCards';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';

import { sendChatMessage, checkHealth, getApiBaseUrl } from './services/api';
import { CANDIDATE_INFO } from './data/candidateData';

const STORAGE_KEY_SESSIONS = 'hireme_chat_sessions_v1';

export default function App() {
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return `session_${Date.now()}`;
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [backendError, setBackendError] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Check backend connectivity on mount
  useEffect(() => {
    const testConnection = async () => {
      const res = await checkHealth();
      setBackendConnected(res.ok);
    };
    testConnection();

    // Recheck every 30s
    const interval = setInterval(testConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  }, [sessions]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Adjust textarea height dynamically
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  // Create or switch to a new chat
  const handleNewChat = () => {
    if (messages.length > 0) {
      // Save current session if it has messages
      updateSessionInList(currentSessionId, messages);
    }
    const newId = `session_${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([]);
    setInput('');
    setBackendError(null);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  // Helper to persist session
  const updateSessionInList = (sessionId, currentMsgs) => {
    if (!currentMsgs || currentMsgs.length === 0) return;
    const firstUserMsg = currentMsgs.find(m => m.role === 'user');
    const title = firstUserMsg ? firstUserMsg.content.slice(0, 36) + (firstUserMsg.content.length > 36 ? '...' : '') : 'Conversation';

    setSessions((prev) => {
      const existingIdx = prev.findIndex(s => s.id === sessionId);
      const updatedItem = {
        id: sessionId,
        title,
        updatedAt: new Date().toISOString(),
        messages: currentMsgs,
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedItem;
        return copy;
      } else {
        return [updatedItem, ...prev].slice(0, 20); // Keep last 20
      }
    });
  };

  // Select a past session
  const handleSelectSession = (sessionId) => {
    if (sessionId === currentSessionId) return;
    
    // Save current
    if (messages.length > 0) {
      updateSessionInList(currentSessionId, messages);
    }

    const found = sessions.find(s => s.id === sessionId);
    if (found) {
      setCurrentSessionId(found.id);
      setMessages(found.messages || []);
      setBackendError(null);
    }
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  // Delete a session
  const handleDeleteSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      handleNewChat();
    }
  };

  // Send message
  const handleSendMessage = async (textToSend) => {
    const question = (textToSend || input).trim();
    if (!question || isLoading) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setBackendError(null);

    const userMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(question);

      if (response.success) {
        setBackendConnected(true);
        const assistantMessage = {
          id: `msg_${Date.now()}_a`,
          role: 'assistant',
          content: response.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const finalMsgs = [...newMessages, assistantMessage];
        setMessages(finalMsgs);
        updateSessionInList(currentSessionId, finalMsgs);
      } else {
        setBackendConnected(false);
        setBackendError(response.troubleshoot);
        
        const fallbackMessage = {
          id: `msg_${Date.now()}_err`,
          role: 'assistant',
          content: `⚠️ **Unable to connect to the backend server.**\n\n${response.troubleshoot}\n\n*Technical Details:* \`${response.error}\`\n\n> Please click the **API Settings** (cog icon) in the top-right header to configure or verify your FastAPI server address.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const finalMsgs = [...newMessages, fallbackMessage];
        setMessages(finalMsgs);
        updateSessionInList(currentSessionId, finalMsgs);
      }
    } catch (err) {
      console.error('Send error:', err);
      setBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickChips = [
    "AWS & Terraform experience",
    "15+ Jenkins pipelines at TCS",
    "Kubernetes orchestration project",
    "Deployment reduction metrics",
    "Why hire Sarthak?",
  ];

  return (
    <div className="chatgpt-layout">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectPrompt={(prompt) => {
          handleSendMessage(prompt);
          if (window.innerWidth < 1024) setSidebarOpen(false);
        }}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        backendConnected={backendConnected}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main chat container */}
      <div className="chat-main-area">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onOpenProfile={() => setProfileOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onClearChat={handleNewChat}
          backendConnected={backendConnected}
          hasMessages={messages.length > 0}
        />

        {/* Connection warning banner if backend is offline */}
        {!backendConnected && (
          <div className="offline-banner animate-fade-in">
            <AlertCircle size={16} />
            <span>
              Backend is currently offline or unreachable at <code>{getApiBaseUrl()}</code>.
            </span>
            <button 
              className="banner-config-btn" 
              onClick={() => setSettingsOpen(true)}
              type="button"
            >
              Configure API URL
            </button>
          </div>
        )}

        {/* Conversation stream */}
        <div className="chat-scroll-container">
          <div className="chat-content-max">
            {messages.length === 0 ? (
              <PromptCards
                onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              />
            ) : (
              <div className="messages-stream">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {isLoading && (
                  <div className="message-row assistant-row animate-fade-in">
                    <div className="message-container">
                      <div className="avatar assistant-avatar pulse-avatar">
                        <Sparkles size={18} />
                      </div>
                      <div className="message-content-wrapper">
                        <div className="message-header">
                          <span className="sender-name">Sarthak AI (Candidate Proxy)</span>
                          <span className="message-time">Analyzing verified resume...</span>
                        </div>
                        <div className="typing-indicator">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Input Section */}
        <div className="chat-bottom-dock">
          <div className="input-box-wrapper">
            {/* Quick Suggestion Chips */}
            <div className="chips-row">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  className="quick-chip-btn"
                  onClick={() => handleSendMessage(chip)}
                  disabled={isLoading}
                  type="button"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="input-pill-container">
              <textarea
                ref={textareaRef}
                rows={1}
                className="chat-textarea"
                placeholder="Ask anything about Sarthak's experience, AWS, CI/CD, or role fit..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />

              <button
                className={`send-action-btn ${input.trim() ? 'send-btn-active' : ''}`}
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                type="button"
              >
                <ArrowUp size={18} />
              </button>
            </div>

            <div className="input-disclaimer">
              AI responses are strictly grounded in Sarthak Mehrotra's verified resume. Zero hallucination guaranteed.
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Profile Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onUrlChanged={(newUrl) => {
          checkHealth(newUrl).then(res => setBackendConnected(res.ok));
        }}
      />
    </div>
  );
}
