import React, { useState } from 'react';
import { X, Download, ExternalLink, Mail, Phone, Briefcase, GraduationCap, CheckCircle, Code, Award, Loader2 } from 'lucide-react';
import { CANDIDATE_INFO } from '../data/candidateData';
import { downloadResume } from '../utils/downloadResume';

export const ProfileModal = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    await downloadResume(false);
    setTimeout(() => setDownloading(false), 1200);
  };

  const handlePreview = () => {
    downloadResume(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2>{CANDIDATE_INFO.name}</h2>
            <span className="modal-subtitle">{CANDIDATE_INFO.title} • {CANDIDATE_INFO.location}</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Stats Grid */}
          <div className="stats-row">
            {CANDIDATE_INFO.keyMetrics.map((metric, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value">{metric.value}</div>
                <div className="stat-label">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Contact & Social Links */}
          <div className="contact-links-bar">
            <a href={`mailto:${CANDIDATE_INFO.email}`} className="contact-pill">
              <Mail size={14} />
              <span>{CANDIDATE_INFO.email}</span>
            </a>
            <a href={CANDIDATE_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="contact-pill">
              <ExternalLink size={14} />
              <span>LinkedIn</span>
            </a>
            <a href={CANDIDATE_INFO.hashnode} target="_blank" rel="noopener noreferrer" className="contact-pill">
              <Code size={14} />
              <span>Hashnode</span>
            </a>
          </div>

          {/* Summary */}
          <div className="section-block">
            <h3><Briefcase size={16} /> Professional Summary</h3>
            <p className="section-text">{CANDIDATE_INFO.summary}</p>
          </div>

          {/* Experience */}
          <div className="section-block">
            <h3><Award size={16} /> Current Role</h3>
            <div className="experience-item">
              <div className="item-header">
                <strong>{CANDIDATE_INFO.currentRole}</strong>
                <span className="item-date">Jan 2025 – Present</span>
              </div>
              <ul className="item-bullets">
                <li>Managed 15+ Jenkins pipelines across dev, non-prod, and production with 95%+ success rate.</li>
                <li>Onboarded multiple Java & .NET applications into CI/CD using shared libraries, cutting manual steps by 75%.</li>
                <li>Streamlined release process, reducing MTTR by 55% and moving releases from bi-weekly to weekly.</li>
              </ul>
            </div>
          </div>

          {/* Key Projects */}
          <div className="section-block">
            <h3><Code size={16} /> Featured Projects</h3>
            <div className="projects-grid">
              {CANDIDATE_INFO.projects.map((proj, i) => (
                <div key={i} className="project-card">
                  <div className="proj-title">{proj.title}</div>
                  <div className="proj-date">{proj.duration}</div>
                  <p className="proj-desc">{proj.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="section-block">
            <h3><CheckCircle size={16} /> Technical Skills</h3>
            <div className="skills-categories">
              {Object.entries(CANDIDATE_INFO.skills).map(([cat, list]) => (
                <div key={cat} className="skill-cat-row">
                  <span className="skill-cat-name">{cat}:</span>
                  <div className="skill-chips">
                    {list.map((skill) => (
                      <span key={skill} className="skill-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="section-block">
            <h3><GraduationCap size={16} /> Education</h3>
            <p className="section-text">{CANDIDATE_INFO.education}</p>
          </div>
        </div>

        <div className="modal-footer">
          <div className="resume-btn-group">
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="download-pdf-btn"
              type="button"
            >
              {downloading ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
              <span>{downloading ? 'Saving to Downloads...' : 'Download Resume (PDF)'}</span>
            </button>

            <button 
              onClick={handlePreview}
              className="preview-tab-btn"
              type="button"
              title="Open PDF directly in browser tab"
            >
              <ExternalLink size={16} />
              <span>Open in Tab</span>
            </button>
          </div>

          <button className="modal-close-action" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
