import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Users, UserRound, Calendar, 
  FileText, LogOut, Menu, X, Bell, Search 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { user, role, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuConfigs = {
    admin: [
      { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
      { label: 'Users', icon: <Users size={20} />, path: '/admin/users' },
      { label: 'Patients', icon: <UserRound size={20} />, path: '/admin/patients' },
      { label: 'Appointments', icon: <Calendar size={20} />, path: '/admin/appointments' },
    ],
    doctor: [
      { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/doctor' },
      { label: 'My Appointments', icon: <Calendar size={20} />, path: '/doctor/appointments' },
      { label: 'Prescriptions', icon: <FileText size={20} />, path: '/doctor/prescriptions' },
    ],
    receptionist: [
      { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/receptionist' },
      { label: 'Patients', icon: <UserRound size={20} />, path: '/receptionist/patients' },
      { label: 'Appointments', icon: <Calendar size={20} />, path: '/receptionist/appointments' },
    ],
    patient: [
      { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/patient' },
      { label: 'My Appointments', icon: <Calendar size={20} />, path: '/patient/appointments' },
      { label: 'My Prescriptions', icon: <FileText size={20} />, path: '/patient/prescriptions' },
    ],
  };

  const menuItems = menuConfigs[role] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <span className="text-white font-black text-xl">C</span>
            </div>
            <span className="text-xl font-black text-slate-900">CarePulse</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <div className="pb-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              Main Menu
            </div>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all w-80">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-slate-100" />
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-900 leading-none">{user?.displayName || 'User'}</div>
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{role}</div>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center font-black text-slate-500 uppercase">
                {user?.email?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
