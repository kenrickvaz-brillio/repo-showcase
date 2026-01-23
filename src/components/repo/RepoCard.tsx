import React from 'react';
import { ExternalLink, BookOpen, Clock, Archive } from 'lucide-react';
import type { Repo } from '../../types/repo';
import { getPrimaryDemoLink } from '../../utils/linkExtractor';
import { formatDistanceToNow } from 'date-fns';
import './RepoCard.css';

interface RepoCardProps {
    repo: Repo;
    onClick: (repo: Repo) => void;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo, onClick }) => {
    const primaryDemo = getPrimaryDemoLink(repo.extractedLinks || { demos: [], docs: [], others: [] }, repo.homepage);

    return (
        <div className="repo-card glass animate-fade-in" onClick={() => onClick(repo)}>
            <div className="repo-card-header">
                <div className="repo-title-row">
                    <h3 className="repo-name">{repo.name}</h3>
                    {repo.archived && <span className="badge archived"><Archive size={12} /> Archived</span>}
                </div>
                <p className="repo-description">{repo.description || 'No description provided.'}</p>
            </div>

            <div className="repo-topics">
                {repo.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="topic-chip">{topic}</span>
                ))}
                {repo.topics.length > 3 && <span className="topic-more">+{repo.topics.length - 3}</span>}
            </div>

            <div className="repo-meta">
                {repo.language && (
                    <span className="language-pill">
                        <span className="language-dot" style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                        {repo.language}
                    </span>
                )}
                {primaryDemo && (
                    <a
                        href={primaryDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="demo-link-inline"
                        onClick={e => e.stopPropagation()}
                    >
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                    </a>
                )}
            </div>

            <div className="repo-footer">
                <div className="repo-updated">
                    <Clock size={12} />
                    <span>Updated {formatDistanceToNow(new Date(repo.updated_at))} ago</span>
                </div>

                <div className="repo-actions" onClick={e => e.stopPropagation()}>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="action-btn" title="View on GitHub">
                        <Github size={16} />
                    </a>
                    <button className="action-btn details" onClick={() => onClick(repo)} title="View Details">
                        <BookOpen size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Github = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

function getLanguageColor(lang: string): string {
    const colors: Record<string, string> = {
        TypeScript: '#3178c6',
        JavaScript: '#f1e05a',
        Python: '#3572A5',
        Go: '#00ADD8',
        Rust: '#dea584',
        Vue: '#41b883',
        Swift: '#ffac45',
        'C#': '#178600',
        Java: '#b07219',
        Ruby: '#701516',
        HTML: '#e34c26',
        CSS: '#563d7c'
    };
    return colors[lang] || '#8b949e';
}
