import { Link } from 'react-router-dom';
import { Database, ArrowRight, Server, Shield, Zap, Layers, Code, Github } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/30">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTU2LCAxNjMsIDE3NSwgMC4xNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center shadow-sm">
              <Database className="w-4 h-4 text-white dark:text-gray-900" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">ThiruXDB</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">Documentation</Link>
            <a href="https://github.com/ThiruXD" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
              <Github className="w-5 h-5" />
            </a>
            <Link to="/dashboard" className="text-sm font-medium px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium mb-8 shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>v0.1.0 is now live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
          The Utilitarian API <br className="hidden md:block" />
          <span className="text-gray-900 dark:text-white">
            Data Aggregation Hub
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Self-host your own data engine. Configure external REST endpoints, automate data fetching into MongoDB, and serve everything through an ultra-fast, rate-limited public API gateway.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard" className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-sm">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/docs" className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium flex items-center justify-center transition shadow-sm">
            Read Documentation
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 text-left">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-5 border border-gray-200 dark:border-gray-700">
              <Server className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Automated Sync</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Automatically batch and insert thousands of records simultaneously from external APIs into your MongoDB database at maximum wire speed.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-5 border border-gray-200 dark:border-gray-700">
              <Code className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Public Gateway</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Expose your aggregated data safely using dynamic API keys with strict short-term rate limits and persistent long-term quota enforcement.</p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-5 border border-gray-200 dark:border-gray-700">
              <Shield className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Robust Security</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Built-in Role-Based Access Control, session hijacking prevention, dynamic zero-config JWT management via Web Crypto, and granular permissions.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
