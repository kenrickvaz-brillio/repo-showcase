import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Repo, RepoFilters, SortOption } from '../types/repo';
import { RepoCard } from '../components/repo/RepoCard';
import { FiltersBar } from '../components/repo/FiltersBar';
import { getPrimaryDemoLink } from '../utils/linkExtractor';
import './GalleryPage.css';

interface GalleryPageProps {
    repos: Repo[];
    filters: RepoFilters;
    setFilters: (filters: RepoFilters) => void;
    sort: SortOption;
    setSort: (sort: SortOption) => void;
    loading: boolean;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
    repos,
    filters,
    setFilters,
    sort,
    setSort,
    loading
}) => {
    const navigate = useNavigate();

    const languages = useMemo(() => {
        const langs = new Set<string>();
        repos.forEach(r => {
            if (r.language) langs.add(r.language);
        });
        return Array.from(langs).sort();
    }, [repos]);

    const filteredAndSortedRepos = useMemo(() => {
        let result = repos.filter(repo => {
            // Search
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                repo.name.toLowerCase().includes(searchLower) ||
                (repo.description?.toLowerCase().includes(searchLower) ?? false) ||
                repo.topics.some(t => t.toLowerCase().includes(searchLower));

            if (!matchesSearch) return false;

            // Languages
            if (filters.languages.length > 0 && (!repo.language || !filters.languages.includes(repo.language))) {
                return false;
            }

            // Has Demo
            if (filters.hasDemo) {
                const hasDemo = !!getPrimaryDemoLink(repo.extractedLinks || { demos: [], docs: [], others: [] }, repo.homepage);
                if (!hasDemo) return false;
            }

            // Archived
            if (!filters.includeArchived && repo.archived) return false;

            // Forks
            if (!filters.includeForks && repo.fork) return false;

            return true;
        });

        // Sort
        result.sort((a, b) => {
            switch (sort) {
                case 'updated_desc':
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                case 'pushed_desc':
                    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
                case 'created_desc':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'stars_desc':
                    return b.stargazers_count - a.stargazers_count;
                case 'forks_desc':
                    return b.forks_count - a.forks_count;
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return result;
    }, [repos, filters, sort]);

    const handleRepoClick = (repo: Repo) => {
        navigate(`/repo/${repo.name}`);
    };

    return (
        <div className="container gallery-page">
            <FiltersBar
                filters={filters}
                setFilters={setFilters}
                sort={sort}
                setSort={setSort}
                languages={languages}
            />

            <div className="gallery-header">
                <h2>Repositories <span>({filteredAndSortedRepos.length})</span></h2>
            </div>

            {loading ? (
                <div className="repo-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="repo-card-skeleton glass"></div>
                    ))}
                </div>
            ) : filteredAndSortedRepos.length > 0 ? (
                <div className="repo-grid">
                    {filteredAndSortedRepos.map(repo => (
                        <RepoCard key={repo.id} repo={repo} onClick={handleRepoClick} />
                    ))}
                </div>
            ) : (
                <div className="empty-state glass">
                    <h3>No repositories found</h3>
                    <p>Try adjusting your search or filters.</p>
                    <button onClick={() => setFilters({
                        search: '',
                        languages: [],
                        hasDemo: null,
                        includeArchived: false,
                        includeForks: false,
                        dateRange: [null, null]
                    })} className="btn-reset">Reset Filters</button>
                </div>
            )}
        </div>
    );
};
