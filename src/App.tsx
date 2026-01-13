import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { GalleryPage } from './pages/GalleryPage';
import { RepoDetail } from './pages/RepoDetail';
import type { Repo, RepoFilters, SortOption } from './types/repo';
import { fetchUserRepos, fetchRepoReadme, enrichRepoWithReadme } from './utils/github';
import './App.css';

const CACHE_KEY = 'repo_showcase_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const USERNAME = 'kenrickvaz-brillio';

function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<RepoFilters>({
    search: '',
    languages: [],
    hasDemo: null,
    includeArchived: false,
    includeForks: false,
    dateRange: [null, null]
  });

  const [sort, setSort] = useState<SortOption>('created_desc');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache
      const cached = localStorage.getItem(`${CACHE_KEY}_${USERNAME}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          setRepos(data);
          setLoading(false);
          return;
        }
      }

      const fetchedRepos = await fetchUserRepos(USERNAME);
      setRepos(fetchedRepos);

      // Cache the basic list
      localStorage.setItem(`${CACHE_KEY}_${USERNAME}`, JSON.stringify({
        data: fetchedRepos,
        timestamp: Date.now()
      }));
    } catch (err: any) {
      setError(err.message);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Background fetch READMEs to populate extracted links
  useEffect(() => {
    if (repos.length > 0 && repos.every(r => !r.readme)) {
      let isSubscribed = true;
      const fetchReadmes = async () => {
        const enrichedRepos = [...repos];
        let hasChanges = false;

        for (let i = 0; i < enrichedRepos.length; i++) {
          if (!isSubscribed) break;
          const repo = enrichedRepos[i];
          try {
            const readme = await fetchRepoReadme(repo.owner.login, repo.name);
            if (readme) {
              enrichedRepos[i] = enrichRepoWithReadme(repo, readme);
              hasChanges = true;
              // Update state in chunks to avoid too many re-renders
              if (i % 3 === 0 || i === enrichedRepos.length - 1) {
                setRepos([...enrichedRepos]);
              }
            }
          } catch (e) {
            console.error(`Failed to fetch readme for ${repo.name}`, e);
          }
        }

        if (hasChanges && isSubscribed) {
          // Update cache with enriched data
          localStorage.setItem(`${CACHE_KEY}_${USERNAME}`, JSON.stringify({
            data: enrichedRepos,
            timestamp: Date.now()
          }));
        }
      };
      fetchReadmes();
      return () => { isSubscribed = false; };
    }
  }, [repos.length]);

  return (
    <Router>
      <div className="app">
        <Header username={USERNAME} />

        {error && (
          <div className="container">
            <div className="error-banner glass">
              <p>{error}</p>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          </div>
        )}

        <main>
          <Routes>
            <Route path="/" element={
              <GalleryPage
                repos={repos}
                filters={filters}
                setFilters={setFilters}
                sort={sort}
                setSort={setSort}
                loading={loading}
              />
            } />
            <Route path="/repo/:repoName" element={
              <RepoDetail repos={repos} isLiveMode={true} />
            } />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Repo Showcase. Built with React & GitHub API.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
