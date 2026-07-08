/**
 * Project: ThiruXDB
 * Author: ThiruXD
 * Description: A self-hosted API data aggregation dashboard — configure external REST endpoints, fetch & store their data into MongoDB, browse and search records, all from a clean web UI.
 */
import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Database,
  Settings,
  LogOut,
  Menu,
  X,
  RefreshCw,
  FileJson,
  Moon,
  Sun,
  Github,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'endpoints', label: 'API Endpoints', icon: Settings },
  { id: 'data', label: 'Data Browser', icon: Database },
  { id: 'fetch', label: 'Fetch Data', icon: RefreshCw },
  { id: 'logs', label: 'Fetch Logs', icon: FileJson },
];

import { Users, Terminal } from 'lucide-react';

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isExportRestricted = (user?.restricted_pages || []).includes('export');

  useEffect(() => {
    if (isExportRestricted) {
      const handleCopy = (e: ClipboardEvent) => e.preventDefault();
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      const handleKeyDown = (e: KeyboardEvent) => {
        // Block Ctrl+C / Cmd+C
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
          e.preventDefault();
        }
        // Block PrintScreen key
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          // Optionally clear clipboard
          navigator.clipboard.writeText('');
        }
        // Block Snipping Tool shortcuts (Win+Shift+S, Cmd+Shift+3/4/5)
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['s', 'S', '3', '4', '5'].includes(e.key)) {
          e.preventDefault();
          triggerBlock();
        }
        // Block DevTools shortcuts
        if (e.key === 'F12') e.preventDefault();
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) {
          e.preventDefault();
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
          e.preventDefault();
        }
      };

      const triggerBlock = () => {
        document.body.innerHTML = `
          <div style="padding: 50px; text-align: center; font-family: system-ui, sans-serif; background: #111827; color: #f3f4f6; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="background: #ef444420; color: #ef4444; padding: 1rem 2rem; border-radius: 999px; font-weight: bold; margin-bottom: 2rem;">
              Security Warning
            </div>
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Developer Tools & Screenshots are Disabled</h2>
            <p style="color: #9ca3af; margin-bottom: 3rem; max-width: 500px; line-height: 1.5;">
              This environment is heavily restricted by the administrator. Any attempts to inspect code or capture data are blocked.
            </p>
            <div style="background: #1f2937; border: 1px solid #374151; padding: 2rem; border-radius: 12px; max-width: 500px; width: 100%;">
              <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">Love this project?</h3>
              <p style="color: #9ca3af; margin-bottom: 1.5rem;">
                Please contribute and follow me on our GitHub repository!
              </p>
              <a href="https://github.com/ThiruXD" target="_blank" style="display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: background 0.2s;">
                GitHub: ThiruXD
              </a>
            </div>
          </div>
        `;
        if (devtoolsDetector) clearInterval(devtoolsDetector);
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'PrintScreen') {
          triggerBlock();
        }
      };

      let devtoolsDetector: number;
      const startDevToolsDetector = () => {
        devtoolsDetector = window.setInterval(() => {
          // Detect docked devtools (size difference)
          if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
            triggerBlock();
          }

          const start = performance.now();
          // eslint-disable-next-line no-debugger
          debugger;
          if (performance.now() - start > 100) {
            triggerBlock();
          }
        }, 1000);
      };
      startDevToolsDetector();

      const handleWindowBlur = () => {
        document.body.style.filter = 'blur(10px)';
        document.body.style.opacity = '0';
      };

      const handleWindowFocus = () => {
        document.body.style.filter = 'none';
        document.body.style.opacity = '1';
      };

      document.addEventListener('copy', handleCopy);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      window.addEventListener('blur', handleWindowBlur);
      window.addEventListener('focus', handleWindowFocus);

      // Print protection
      const style = document.createElement('style');
      style.innerHTML = `@media print { body { display: none !important; } }`;
      document.head.appendChild(style);

      return () => {
        document.removeEventListener('copy', handleCopy);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('blur', handleWindowBlur);
        window.removeEventListener('focus', handleWindowFocus);
        document.head.removeChild(style);
        clearInterval(devtoolsDetector);
        // Clean up styles
        document.body.style.filter = 'none';
        document.body.style.opacity = '1';
      };
    }
  }, [isExportRestricted]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-200 ${isExportRestricted ? 'select-none' : ''}`}>
      {/* Mobile top navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 flex items-center px-4 justify-between transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center shadow-lg shrink-0">
            <Database className="w-4 h-4 text-white dark:text-gray-900" />
          </div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white">ThiruXDB</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition"
          >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 lg:inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:block p-6 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <Database className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">ThiruXDB</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">API Manager</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.filter(item => !(user?.restricted_pages || []).includes(item.id)).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => {
                    onNavigate('livelogs');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPage === 'livelogs'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <Terminal className="w-5 h-5" />
                  <span className="font-medium">Live Terminal Logs</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('users');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPage === 'users'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">System Security</span>
                </button>
              </>
            )}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'viewer'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hidden lg:block p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition mr-1"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Copyright Strip */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              &copy; {new Date().getFullYear()}
              <a href="https://github.com/ThiruXD/ThiruXDB-API-Aggregator" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-gray-900 dark:hover:text-white transition flex items-center gap-1 ml-1">
                <Github className="w-3.5 h-3.5" /> By ThiruXD
              </a>
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 flex flex-col">
        <div className="p-4 lg:p-8 flex-1">{children}</div>

        {/* Mobile Copyright Strip */}
        <div className="lg:hidden p-4 border-t border-gray-200 dark:border-gray-800 text-center mt-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            &copy; {new Date().getFullYear()}
            <a href="https://github.com/ThiruXD/ThiruXDB-API-Aggregator" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-gray-900 dark:hover:text-white transition flex items-center gap-1 ml-1">
              <Github className="w-3.5 h-3.5" /> By ThiruXD
            </a>
          </p>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
