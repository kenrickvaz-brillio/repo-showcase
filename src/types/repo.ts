export interface Repo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    topics: string[];
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    homepage: string | null;
    archived: boolean;
    disabled: boolean;
    fork: boolean;
    owner: {
        login: string;
        avatar_url: string;
    };
    readme?: string;
    extractedLinks?: ExtractedLinks;
}

export interface ExtractedLinks {
    demos: Array<{ url: string; label: string }>;
    docs: Array<{ url: string; label: string }>;
    others: Array<{ url: string; label: string }>;
}

export interface RepoFilters {
    search: string;
    languages: string[];
    hasDemo: boolean | null;
    includeArchived: boolean;
    includeForks: boolean;
    dateRange: [Date | null, Date | null];
}

export type SortOption =
    | 'updated_desc'
    | 'pushed_desc'
    | 'created_desc'
    | 'stars_desc'
    | 'forks_desc'
    | 'name_asc';
