import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Menu, X, Sun, Moon, ArrowLeft, Github, Database, BookOpen, Layers, Network, RefreshCw, ShieldCheck, Code } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const markdownFiles = import.meta.glob('../docs/*.md', { query: '?raw', import: 'default', eager: true });

const DOCS_PAGES = [
  { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
  { id: 'architecture', title: 'Architecture & Stack', icon: Layers },
  { id: 'api-gateway', title: 'API Gateway', icon: Network },
  { id: 'sync-engine', title: 'Sync Engine', icon: RefreshCw },
  { id: 'security', title: 'Security', icon: ShieldCheck },
  { id: 'development', title: 'Development & Contributing', icon: Code },
];

export function DocsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  const currentPath = location.pathname.split('/').pop() || 'getting-started';
  const page = DOCS_PAGES.find((p) => p.id === currentPath) || DOCS_PAGES[0];

  const markdownContent =
    (markdownFiles[`../docs/${page.id}.md`] as string) || '# 404 Not Found\n\nThe requested documentation page could not be found.';

  // Remove H1 since we render it separately
  const contentWithoutH1 = markdownContent.replace(/^#\s+.*$/m, '');

  const toc = useMemo(() => {
    const matches = Array.from(contentWithoutH1.matchAll(/^(##|###)\s+(.+)$/gm));
    return matches.map((match) => {
      const depth = match[1].length;
      const title = match[2].trim();
      const url = '#' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { title, url, depth };
    });
  }, [contentWithoutH1]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ScrollSpy for TOC
  useEffect(() => {
    const handleScroll = () => {
      const headings = Array.from(document.querySelectorAll('main h2, main h3'));
      if (headings.length === 0) return;
      
      let currentActiveId = '';
      for (const heading of headings) {
        const top = heading.getBoundingClientRect().top;
        if (top < 150) { // Highlight when heading is near the top
          currentActiveId = heading.id;
        }
      }
      setActiveHeadingId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [markdownContent]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 flex flex-col font-sans">
      {/* Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-zinc-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Database className="w-4 h-4 text-white dark:text-gray-900" />
              </div>
              <span className="font-bold text-lg hidden sm:inline-block">ThiruXDB Docs</span>
            </Link>
          </div>
          <div className="flex-1" />
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors hidden sm:flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <a href="https://github.com/ThiruXD/ThiruXDB" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </header>

      <div className="pt-16 flex-1 flex container max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 pt-16 transform transition-transform duration-300 ease-in-out lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:pt-0 lg:translate-x-0 bg-white dark:bg-zinc-950 lg:bg-transparent border-r border-gray-200 dark:border-zinc-800 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto p-6">
            <h4 className="font-semibold text-sm tracking-tight text-gray-900 dark:text-zinc-100 mb-4 px-2">
              Documentation
            </h4>
            <nav className="flex flex-col space-y-1">
              {DOCS_PAGES.map((navPage) => {
                const isActive = page.id === navPage.id;
                return (
                  <Link
                    key={navPage.id}
                    to={`/docs/${navPage.id}`}
                    className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-gray-100 dark:bg-zinc-800/60 font-medium text-gray-900 dark:text-zinc-100'
                        : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 hover:text-gray-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <navPage.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-zinc-500'}`} />
                    {navPage.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 py-8 lg:py-12 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-zinc-100 mb-8">
              {page.title}
            </h1>
            <div className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 [&_:not(pre)>code]:bg-gray-100 dark:[&_:not(pre)>code]:bg-zinc-800/60 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:font-medium [&_:not(pre)>code]:before:content-none [&_:not(pre)>code]:after:content-none max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
              >
                {contentWithoutH1}
              </ReactMarkdown>
            </div>
            
            {/* Pagination / Next Steps */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center">
              {DOCS_PAGES.findIndex(p => p.id === page.id) > 0 ? (
                <Link 
                  to={`/docs/${DOCS_PAGES[DOCS_PAGES.findIndex(p => p.id === page.id) - 1].id}`}
                  className="group flex flex-col items-start gap-1"
                >
                  <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">Previous</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {DOCS_PAGES[DOCS_PAGES.findIndex(p => p.id === page.id) - 1].title}
                  </span>
                </Link>
              ) : <div />}
              
              {DOCS_PAGES.findIndex(p => p.id === page.id) < DOCS_PAGES.length - 1 ? (
                <Link 
                  to={`/docs/${DOCS_PAGES[DOCS_PAGES.findIndex(p => p.id === page.id) + 1].id}`}
                  className="group flex flex-col items-end gap-1"
                >
                  <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">Next</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {DOCS_PAGES[DOCS_PAGES.findIndex(p => p.id === page.id) + 1].title}
                  </span>
                </Link>
              ) : <div />}
            </div>
          </div>
        </main>

        {/* Right Sidebar (TOC) */}
        <aside className="hidden xl:block w-64 shrink-0 border-l border-gray-200 dark:border-zinc-800 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
          <div className="h-full overflow-y-auto py-8 pl-8">
            <h4 className="font-semibold text-sm tracking-tight text-gray-900 dark:text-zinc-100 mb-4">
              On this page
            </h4>
            {toc.length > 0 ? (
              <ul className="space-y-2.5 text-sm">
                {toc.map((item, index) => (
                  <li key={index} style={{ paddingLeft: `${(item.depth - 2) * 1}rem` }}>
                    <a
                      href={item.url}
                      className={`block border-l-2 py-1 pl-3 transition-all duration-200 ${
                        activeHeadingId === item.url.slice(1)
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100'
                      }`}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 dark:text-zinc-500">No headings found</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
