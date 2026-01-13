import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import './Header.css';

interface HeaderProps {
    username: string;
}

export const Header: React.FC<HeaderProps> = ({ username }) => {
    return (
        <header className="header glass">
            <div className="container header-content">
                <div className="logo">
                    <Github size={32} className="logo-icon" />
                    <h1>Repo<span>Showcase</span></h1>
                </div>

                <div className="controls">
                    <a
                        href={`https://github.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="profile-link"
                    >
                        <span>@{username}</span>
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </header>
    );
};
