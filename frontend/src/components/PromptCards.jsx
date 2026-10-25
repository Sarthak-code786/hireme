import React from 'react';
import { Sparkles, Terminal, Cloud, GitBranch, Award, ArrowUpRight } from 'lucide-react';
import { CANDIDATE_INFO } from '../data/candidateData';

export const PromptCards = ({ onSelectPrompt }) => {
  const cards = [
    {
      icon: <GitBranch size={22} className="card-icon text-green" />,
      tag: "TCS Experience",
      title: "DevOps & CI/CD Pipelines",
      query: "Walk me through Sarthak's experience managing CI/CD pipelines at TCS. What applications and tools did he manage?",
    },
    {
      icon: <Cloud size={22} className="card-icon text-blue" />,
      tag: "Cloud & Automation",
      title: "AWS & Terraform Infrastructure",
      query: "What AWS services and Terraform automation has Sarthak worked with? Describe his hands-on cloud experience.",
    },
    {
      icon: <Terminal size={22} className="card-icon text-purple" />,
      tag: "Containerization",
      title: "Docker & Kubernetes Debugging",
      query: "Tell me about his Kubernetes container orchestration project and how he troubleshoots container networking and pod issues.",
    },
    {
      icon: <Award size={22} className="card-icon text-amber" />,
      tag: "Hiring Decision",
      title: "Why Hire Sarthak?",
      query: "Why should our company hire Sarthak Mehrotra for a DevOps / Cloud Engineer role? What are his key strengths?",
    },
  ];

  return (
    <div className="hero-container animate-fade-in">
      <div className="hero-badge">
        <Sparkles size={16} />
        <span>Strict Ground Truth • Zero Hallucination AI Proxy</span>
      </div>

      <div className="hero-avatar-wrapper">
        <div className="hero-avatar-ring">
          <div className="hero-avatar">
            <span>SM</span>
          </div>
        </div>
      </div>

      <h1 className="hero-title">
        Meet Sarthak Mehrotra
      </h1>
      
      <p className="hero-subtitle">
        DevOps Engineer at TCS • AWS, Jenkins, Docker, Kubernetes & Terraform.
        <br />
        Ask anything about his career, verified metrics, or job qualifications.
      </p>

      <div className="prompt-grid">
        {cards.map((card, index) => (
          <button
            key={index}
            className="prompt-card"
            onClick={() => onSelectPrompt(card.query)}
            type="button"
          >
            <div className="prompt-card-top">
              {card.icon}
              <span className="card-tag">{card.tag}</span>
              <ArrowUpRight size={16} className="card-arrow" />
            </div>
            <div className="prompt-card-title">{card.title}</div>
            <p className="prompt-card-desc">"{card.query}"</p>
          </button>
        ))}
      </div>
    </div>
  );
};
