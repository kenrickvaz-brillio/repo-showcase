import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, GitFork, ExternalLink, Github, Calendar, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Repo } from '../types/repo';
import { fetchRepoReadme, enrichRepoWithReadme } from '../utils/github';
import { format } from 'date-fns';
import './RepoDetail.css';

interface RepoDetailProps {
    repos: Repo[];
    isLiveMode: boolean;
}

export const RepoDetail: React.FC<RepoDetailProps> = ({ repos, isLiveMode }) => {
    const { repoName } = useParams<{ repoName: string }>();
    const navigate = useNavigate();
    const [repo, setRepo] = useState<Repo | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'rendered' | 'raw'>('rendered');

    useEffect(() => {
        const foundRepo = repos.find(r => r.name === repoName);
        if (foundRepo) {
            if (isLiveMode && !foundRepo.readme) {
                setLoading(true);
                fetchRepoReadme(foundRepo.owner.login, foundRepo.name)
                    .then((readme: string | null) => {
                        setRepo(enrichRepoWithReadme(foundRepo, readme));
                        setLoading(false);
                    })
                    .catch(() => {
                        setRepo(foundRepo);
                        setLoading(false);
                    });
            } else {
                setRepo(foundRepo);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [repoName, repos, isLiveMode]);

    if (loading) {
        return (
            <div className="container detail-loading">
                <div className="skeleton title"></div>
                <div className="skeleton content"></div>
            </div>
        );
    }

    if (!repo) {
        return (
            <div className="container error-state">
                <h2>Repository not found</h2>
                <button onClick={() => navigate('/')} className="btn-back">
                    <ArrowLeft size={20} /> Back to Gallery
                </button>
            </div>
        );
    }

    return (
        <div className="container repo-detail animate-fade-in">
            <button onClick={() => navigate('/')} className="btn-back">
                <ArrowLeft size={20} /> Back to Gallery
            </button>

            <div className="detail-header">
                <div className="header-main">
                    <div className="title-section">
                        <h1>{repo.name}</h1>
                        <div className="detail-badges">
                            {repo.language && <span className="lang-badge">{repo.language}</span>}
                            {repo.archived && <span className="archived-badge">Archived</span>}
                            {repo.fork && <span className="fork-badge">Forked</span>}
                        </div>
                    </div>
                    <p className="detail-description">{repo.description}</p>

                    <div className="detail-links">
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="link-btn github">
                            <Github size={18} /> View on GitHub
                        </a>
                        {repo.homepage && (
                            <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="link-btn demo">
                                <ExternalLink size={18} /> Live Demo
                            </a>
                        )}
                    </div>
                </div>

                <div className="header-stats glass">
                    <div className="stat-item">
                        <Star size={20} />
                        <div className="stat-info">
                            <span className="stat-value">{repo.stargazers_count}</span>
                            <span className="stat-label">Stars</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <GitFork size={20} />
                        <div className="stat-info">
                            <span className="stat-value">{repo.forks_count}</span>
                            <span className="stat-label">Forks</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <Info size={20} />
                        <div className="stat-info">
                            <span className="stat-value">{repo.open_issues_count}</span>
                            <span className="stat-label">Issues</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-grid">
                <div className="readme-section glass">
                    <div className="readme-header">
                        <div className="tabs">
                            <button
                                className={activeTab === 'rendered' ? 'active' : ''}
                                onClick={() => setActiveTab('rendered')}
                            >
                                README.md
                            </button>
                            <button
                                className={activeTab === 'raw' ? 'active' : ''}
                                onClick={() => setActiveTab('raw')}
                            >
                                Raw
                            </button>
                        </div>
                    </div>

                    <div className="readme-content">
                        {repo.readme ? (
                            activeTab === 'rendered' ? (
                                <div className="markdown-body">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {repo.readme}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <pre className="raw-readme">{repo.readme}</pre>
                            )
                        ) : (
                            <div className="no-readme">No README found for this repository.</div>
                        )}
                    </div>
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-card glass">
                        <h3>Repository Info</h3>
                        <div className="info-list">
                            <div className="info-item">
                                <Calendar size={16} />
                                <div>
                                    <span className="info-label">Created</span>
                                    <span className="info-value">{format(new Date(repo.created_at), 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <Clock size={16} />
                                <div>
                                    <span className="info-label">Last Updated</span>
                                    <span className="info-value">{format(new Date(repo.updated_at), 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <Github size={16} />
                                <div>
                                    <span className="info-label">Owner</span>
                                    <span className="info-value">{repo.owner.login}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {repo.extractedLinks && (repo.extractedLinks.demos.length > 0 || repo.extractedLinks.docs.length > 0) && (
                        <div className="sidebar-card glass">
                            <h3>Extracted Links</h3>
                            <div className="extracted-links">
                                {repo.extractedLinks.demos.map((link: { url: string; label: string }, i: number) => (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="extracted-link demo">
                                        <ExternalLink size={14} /> {link.label}
                                    </a>
                                ))}
                                {repo.extractedLinks.docs.map((link: { url: string; label: string }, i: number) => (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="extracted-link docs">
                                        <BookOpen size={14} /> {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="sidebar-card glass">
                        <h3>Topics</h3>
                        <div className="topics-cloud">
                            {repo.topics.map((topic: string) => (
                                <span key={topic} className="topic-tag">{topic}</span>
                            ))}
                            {repo.topics.length === 0 && <span className="no-topics">No topics listed.</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookOpen = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

const Clock = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);
