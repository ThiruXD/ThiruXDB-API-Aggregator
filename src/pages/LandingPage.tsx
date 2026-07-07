import { Link } from 'react-router-dom';
import { Database, ArrowRight, Server, Shield, Zap, Layers, Code, Github } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/30">
      {/* Premium Gradient Background Blurs */}
      <div className="absolute top-0 inset-x-0 h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-200/50 dark:border-white/5 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">ThiruXDB</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">Documentation</Link>
            <a href="https://github.com/ThiruXD" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
              <Github className="w-5 h-5" />
            </a>
            <Link to="/dashboard" className="text-sm font-medium px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-black rounded-full hover:scale-105 transition-transform shadow-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          <span>v0.1.0 is now live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
          The Ultimate API <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Data Aggregation Hub
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Self-host your own data engine. Configure external REST endpoints, automate data fetching into MongoDB, and serve everything through an ultra-fast, rate-limited public API gateway.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium text-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-500/30">
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/docs" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-full font-medium text-lg flex items-center justify-center transition-all">
            Read Documentation
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left">
          <div className="p-8 rounded-3xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-white/5 hover:border-indigo-500/30 transition-colors">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Automated Sync</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Automatically batch and insert thousands of records simultaneously from external APIs into your MongoDB database at maximum wire speed.</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-white/5 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Public Gateway</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Expose your aggregated data safely using dynamic API keys with strict short-term rate limits and persistent long-term quota enforcement.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-white/5 hover:border-pink-500/30 transition-colors">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Robust Security</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Built-in Role-Based Access Control, session hijacking prevention, dynamic zero-config JWT management via Web Crypto, and granular permissions.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
