import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { RepoFilters, SortOption } from '../../types/repo';
import './FiltersBar.css';

interface FiltersBarProps {
    filters: RepoFilters;
    setFilters: (filters: RepoFilters) => void;
    sort: SortOption;
    setSort: (sort: SortOption) => void;
    languages: string[];
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
    filters,
    setFilters,
    sort,
    setSort,
    languages
}) => {
    const handleLanguageToggle = (lang: string) => {
        const newLangs = filters.languages.includes(lang)
            ? filters.languages.filter(l => l !== lang)
            : [...filters.languages, lang];
        setFilters({ ...filters, languages: newLangs });
    };

    return (
        <div className="filters-bar glass animate-fade-in">
            <div className="filters-section">
                <div className="filter-group">
                    <label>Search</label>
                    <input
                        type="text"
                        placeholder="Search repos..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                <div className="filter-group">
                    <label>Language</label>
                    <div className="language-chips">
                        {languages.map(lang => (
                            <button
                                key={lang}
                                className={`lang-chip ${filters.languages.includes(lang) ? 'active' : ''}`}
                                onClick={() => handleLanguageToggle(lang)}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>


            </div>

            <div className="sort-section">
                <label>Sort By</label>
                <div className="select-wrapper">
                    <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
                        <option value="updated_desc">Recently Updated</option>
                        <option value="pushed_desc">Recently Pushed</option>
                        <option value="created_desc">Recently Created</option>
                        <option value="stars_desc">Stars (High to Low)</option>
                        <option value="forks_desc">Forks (High to Low)</option>
                        <option value="name_asc">Name (A-Z)</option>
                    </select>
                    <ChevronDown size={16} className="select-icon" />
                </div>
            </div>
        </div>
    );
};
