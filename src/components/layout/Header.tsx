import React from 'react';
import { Github, ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

interface HeaderProps {
    username: string;
}

export const Header: React.FC<HeaderProps> = ({ username }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header glass">
            <div className="container header-content">
                <div className="logo">
                    <Github size={32} className="logo-icon" />
                    <h1>Repo<span>Showcase</span></h1>
                </div>

                <div className="controls">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
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
