import type { ExtractedLinks } from '../types/repo';

const DEMO_KEYWORDS = /demo|live|preview|try|deployed|vercel|netlify|github pages|app|site|preview|playground|itch\.io/i;
const DOCS_KEYWORDS = /docs|documentation|wiki|guide|read more|tutorial/i;

export function extractLinksFromMarkdown(markdown: string | null | undefined): ExtractedLinks {
    const links: ExtractedLinks = {
        demos: [],
        docs: [],
        others: []
    };

    if (!markdown) return links;

    // Regex to find markdown links: [label](url)
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let match;

    const seenUrls = new Set<string>();

    while ((match = markdownLinkRegex.exec(markdown)) !== null) {
        const label = match[1].trim();
        const url = match[2].trim();

        if (seenUrls.has(url)) continue;
        seenUrls.add(url);

        // Context window: look at the label and surrounding text (if possible, but label is usually enough)
        if (DEMO_KEYWORDS.test(label) || DEMO_KEYWORDS.test(url)) {
            links.demos.push({ url, label });
        } else if (DOCS_KEYWORDS.test(label) || DOCS_KEYWORDS.test(url)) {
            links.docs.push({ url, label });
        } else {
            links.others.push({ url, label });
        }
    }

    // Also look for bare URLs that might be demos
    const bareUrlRegex = /(?:^|\s)(https?:\/\/[^\s)]+)(?:\s|$)/g;
    while ((match = bareUrlRegex.exec(markdown)) !== null) {
        const url = match[1].trim();
        if (seenUrls.has(url)) continue;

        // For bare URLs, we check if they contain keywords or common hosting platforms
        if (DEMO_KEYWORDS.test(url)) {
            seenUrls.add(url);
            links.demos.push({ url, label: 'Live Demo' });
        }
    }

    return links;
}

export function getPrimaryDemoLink(links: ExtractedLinks, homepage: string | null): string | null {
    if (homepage) return homepage;
    if (links.demos.length > 0) return links.demos[0].url;
    return null;
}
