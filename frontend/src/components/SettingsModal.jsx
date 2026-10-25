import React, { useState } from 'react';
import { X, Server, Check, AlertCircle, RefreshCw, Globe, HelpCircle } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, resetApiBaseUrl, checkHealth } from '../services/api';

export const SettingsModal = ({ isOpen, onClose, onUrlChanged }) => {
  const [url, setUrl] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const saved = setApiBaseUrl(url);
    setUrl(saved);
    if (onUrlChanged) onUrlChanged(saved);
    onClose();
  };

  const handleReset = () => {
    const defaultUrl = resetApiBaseUrl();
    setUrl(defaultUrl);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await checkHealth(url.trim());
    setTesting(false);
    setTestResult(res);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2>Backend API Configuration</h2>
            <span className="modal-subtitle">Connect this ChatGPT frontend to your FastAPI backend</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-field">
            <label className="field-label">
              <Server size={16} />
              <span>FastAPI Backend URL</span>
            </label>
            <div className="input-group">
              <input
                type="text"
                className="text-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:8000 or https://your-backend.vercel.app"
              />
            </div>
            <p className="field-hint">
              Default is <code>http://localhost:8000</code>. When deploying frontend on Vercel, enter your deployed FastAPI server URL here.
            </p>
          </div>

          <div className="connection-test-section">
            <button
              className="test-btn"
              onClick={handleTestConnection}
              disabled={testing || !url.trim()}
              type="button"
            >
              <RefreshCw size={14} className={testing ? 'spin' : ''} />
              <span>{testing ? 'Testing Connection...' : 'Test Connection'}</span>
            </button>

            {testResult && (
              <div className={`test-badge ${testResult.ok ? 'test-success' : 'test-failure'}`}>
                {testResult.ok ? (
                  <>
                    <Check size={16} />
                    <span>Connected successfully! (Backend responded: "{testResult.data?.message || 'OK'}")</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    <span>Failed to connect: {testResult.error}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="info-card">
            <div className="info-title">
              <HelpCircle size={15} />
              <span>Local Development Checklist:</span>
            </div>
            <ol className="info-list">
              <li>Open a terminal in <code>week2/hireme/backend</code></li>
              <li>Activate virtual environment and run: <code>uvicorn main:app --reload --port 8000</code></li>
              <li>Ensure CORS middleware is active in <code>main.py</code> so browser can communicate without restrictions.</li>
            </ol>
          </div>
        </div>

        <div className="modal-footer">
          <button className="reset-btn" onClick={handleReset} type="button">
            Reset to Default
          </button>
          <div className="footer-actions">
            <button className="modal-close-action" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="primary-action-btn" onClick={handleSave} type="button">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
