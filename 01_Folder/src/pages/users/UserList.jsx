import React, { useState, useEffect } from 'react';
import { subscribeToUsers, deleteUser } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { Search, Trash2, Shield, User, Stethoscope, UserRound } from 'lucide-react';

const UserList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    const role = roleFilter === 'All' ? null : roleFilter.toLowerCase();
    const unsubscribe = subscribeToUsers(role, (data) => {
      setUsers(data || []);
      setLoading(false);
    });
    return () => unsubscribe?.();
  }, [roleFilter]);

  const handleDelete = async (userId) => {
    if (userId === currentUser?.uid) {
      alert("You cannot delete your own account.");
      return;
    }
    if (window.confirm('Are you sure?')) {
      await deleteUser(userId);
    }
  };

  const filteredUsers = (users || []).filter(user => 
    (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield size={16} className="text-purple-600" />;
      case 'doctor': return <Stethoscope size={16} className="text-blue-600" />;
      case 'patient': return <UserRound size={16} className="text-emerald-600" />;
      default: return <User size={16} className="text-slate-600" />;
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading Users...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-slate-900">User Management</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" placeholder="Search..." 
            className="w-full outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {['All', 'Doctor', 'Patient', 'Admin'].map((r) => (
            <button
              key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-bold ${roleFilter === r ? 'bg-white shadow-sm' : 'text-slate-500'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-xs font-black text-slate-500 uppercase">User</th>
              <th className="p-6 text-xs font-black text-slate-500 uppercase">Role</th>
              <th className="p-6 text-xs font-black text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-6 font-bold text-slate-900">{u.name} <br/><span className="text-xs text-slate-400 font-medium">{u.email}</span></td>
                <td className="p-6 capitalize text-sm font-bold text-slate-600">{u.role}</td>
                <td className="p-6 text-right">
                  <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
