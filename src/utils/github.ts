import type { Repo } from '../types/repo';
import { extractLinksFromMarkdown } from './linkExtractor';

const BASE_URL = 'https://api.github.com';

export async function fetchUserRepos(username: string): Promise<Repo[]> {
    const response = await fetch(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`);

    if (!response.ok) {
        if (response.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later or use mock data.');
        }
        throw new Error(`Failed to fetch repos: ${response.statusText}`);
    }

    const repos = await response.json();
    return repos.map((repo: any) => ({
        ...repo,
        topics: repo.topics || [],
        extractedLinks: { demos: [], docs: [], others: [] } // Will be populated when README is fetched
    }));
}

export async function fetchRepoReadme(owner: string, repo: string): Promise<string | null> {
    // Try the official API first
    try {
        const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/readme`);
        if (response.ok) {
            const data = await response.json();
            // Content is base64 encoded
            return atob(data.content);
        }
    } catch (e) {
        console.error(`Failed to fetch readme via API for ${owner}/${repo}`, e);
    }

    // Fallback to raw content
    const branches = ['main', 'master'];
    for (const branch of branches) {
        try {
            const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`);
            if (response.ok) {
                return await response.text();
            }
        } catch (e) {
            // Continue to next branch
        }
    }

    return null;
}

export function enrichRepoWithReadme(repo: Repo, readme: string | null): Repo {
    if (!readme) return repo;
    return {
        ...repo,
        readme,
        extractedLinks: extractLinksFromMarkdown(readme)
    };
}
