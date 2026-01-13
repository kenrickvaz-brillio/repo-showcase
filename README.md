# Repo Showcase

A modern, high-performance portfolio application designed to showcase GitHub repositories. Built with React and TypeScript, it fetches real-time data from the GitHub API, automatically extracts demo links from READMEs, and presents projects in a premium, glassmorphism-styled interface.

**[Live Demo](https://witty-coast-00f387c1e.6.azurestaticapps.net)**

## 🚀 Features

- **Live GitHub Integration**: Fetches public repositories directly from the GitHub REST API.
- **Intelligent Link Extraction**: Automatically scans repository READMEs to find and categorize **Demo** and **Documentation** links.
- **Smart Caching**: Implements `localStorage` caching with a 30-minute TTL to ensure fast load times and respect GitHub API rate limits.
- **Advanced Sorting & Filtering**:
  - Sort by: Recently Created (default), Recently Updated, Stars, Forks, etc.
  - Filter by: Search query, Language.
- **Rich Repository Details**:
  - Full README rendering with GFM (GitHub Flavored Markdown) support.
  - Quick access to source code, live demos, and documentation.
  - Repository stats (Stars, Forks, Topics).
- **Premium UI/UX**:
  - **Glassmorphism** design language.
  - Fully responsive layout for all devices.
  - Smooth animations using Framer Motion.
  - Dark mode aesthetic.

## 🛠️ Tech Stack

- **Core**: [React 18](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with CSS Variables (Design Tokens)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown), `remark-gfm`, `rehype-raw`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Utilities**: `date-fns` for time formatting

## ⚙️ Configuration

The application is currently configured for a specific user but can be easily customized.

### Changing the Target User
To showcase a different GitHub profile, modify the `USERNAME` constant in `src/App.tsx`:

```typescript
// src/App.tsx
const USERNAME = 'your-github-username';
```

### Caching
Data is cached to `localStorage` to minimize API calls.
- **Key**: `repo_showcase_cache_{username}`
- **TTL**: 30 minutes (configurable via `CACHE_TTL` in `src/App.tsx`)

## 🔍 How Link Extraction Works

The application uses a heuristic approach (`src/utils/linkExtractor.ts`) to find the best "Demo" link for a project:

1.  **GitHub Homepage**: The URL set in the repository's "About" section is always prioritized.
2.  **README Scanning**: If no homepage is set, the app parses the README markdown for links containing keywords like:
    - `demo`, `live`, `preview`, `try`, `app`, `site`, `playground`
    - Deployment domains: `vercel.app`, `netlify.app`, `github.io`, `itch.io`

## 📦 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/repo-showcase.git
    cd repo-showcase
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Footer
│   └── repo/         # RepoCard, FiltersBar, RepoGrid
├── data/             # Mock data (unused in production)
├── pages/            # GalleryPage, RepoDetail
├── types/            # TypeScript interfaces
├── utils/            # GitHub API client, Link Extractor
├── App.tsx           # Main application logic & state
└── index.css         # Global styles & design tokens
```

## 📄 License

MIT
