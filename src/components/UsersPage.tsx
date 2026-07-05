import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { User, ActivityLog, UserRole, UserFormData } from '../types/database';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Activity,
  UserPlus,
  Shield,
  Clock,
  Laptop,
  Globe,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';

export function UsersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'activity'>('users');
  
  // Users State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Activity Logs State
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    role: 'viewer',
    is_active: true
  });

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else fetchLogs(page);
  }, [activeTab, page]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
    setIsLoadingUsers(false);
  };

  const fetchLogs = async (p: number) => {
    setIsLoadingLogs(true);
    try {
      const data = await api.getActivityLogs({ page: p, limit: 20 });
      setLogs(data.logs);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
    setIsLoadingLogs(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
      } else {
        await api.createUser(formData);
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const openForm = (u?: User) => {
    if (u) {
      setEditingUser(u);
      setFormData({ username: u.username, role: u.role, is_active: u.is_active });
    } else {
      setEditingUser(null);
      setFormData({ username: '', password: '', role: 'viewer', is_active: true });
    }
    setShowForm(true);
  };

  if (user?.role !== 'admin') {
    return <div className="text-red-500">Access Denied. Admins only.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">System Security</h1>
          <p className="text-slate-400 mt-1">Manage users, roles, and view activity logs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700 pb-px">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition ${
            activeTab === 'users' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" /> Users
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition ${
            activeTab === 'activity' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          <Activity className="w-4 h-4" /> Activity Logs
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => openForm()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
              <UserPlus className="w-4 h-4" /> Add User
            </button>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800 border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Username</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Last Seen</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-700/20 transition">
                      <td className="px-6 py-4 font-medium text-white">{u.username}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${
                          u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                          u.role === 'editor' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-slate-500/10 text-slate-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.is_active ? <span className="text-green-400">Active</span> : <span className="text-red-400">Disabled</span>}
                      </td>
                      <td className="px-6 py-4">
                        {u.last_seen ? new Date(u.last_seen).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openForm(u)} className="p-2 text-slate-400 hover:text-blue-400 transition"><Edit className="w-4 h-4"/></button>
                        {u.id !== user?.id && (
                          <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-400 transition"><Trash2 className="w-4 h-4"/></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'activity' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                  <th className="px-6 py-4 font-medium">Device Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-700/20 transition">
                    <td className="px-6 py-4 whitespace-nowrap"><Clock className="w-3 h-3 inline mr-1 text-slate-500"/>{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-white">{log.username}</td>
                    <td className="px-6 py-4 text-blue-400">{log.action}</td>
                    <td className="px-6 py-4 font-mono text-xs"><Globe className="w-3 h-3 inline mr-1 text-slate-500"/>{log.ip_address}</td>
                    <td className="px-6 py-4 text-xs text-slate-400"><Laptop className="w-3 h-3 inline mr-1 text-slate-500"/>{log.device_info}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 border-t border-slate-700 flex justify-between items-center">
            <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50">Prev</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">{editingUser ? 'Edit User' : 'New User'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} disabled={!!editingUser} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{editingUser ? 'New Password (leave blank to keep)' : 'Password'}</label>
                <input required={!editingUser} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="admin">Admin (Full Access)</option>
                  <option value="editor">Editor (Can't manage users)</option>
                  <option value="viewer">Viewer (Read Only)</option>
                </select>
              </div>
              {editingUser && editingUser.id !== user?.id && (
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 bg-slate-900 border-slate-700 rounded" />
                  <label htmlFor="active" className="text-sm text-slate-300">Account Active</label>
                </div>
              )}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Save className="w-4 h-4"/> Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
