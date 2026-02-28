import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Menu, X, ChevronRight } from 'lucide-react';

const Navbar = ({ onOpenLogin }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-slate-900 rounded-[14px] flex items-center justify-center group-hover:bg-blue-600 group-hover:rotate-[10deg] transition-all duration-500 shadow-lg shadow-slate-200">
            <span className="text-white font-black text-2xl leading-none">C</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">CarePulse</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-10">
          {[
            { name: 'Product', path: '/product' },
            { name: 'Solutions', path: '/solutions' },
            { name: 'Pricing', path: '/pricing' },
            { name: 'Resources', path: '/resources' }
          ].map((item) => (
            <Link 
              key={item.name}
              to={item.path} 
              className="text-slate-500 font-bold hover:text-blue-600 transition-colors tracking-tight text-[15px]"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to={`/${role}`}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
              >
                <LayoutDashboard size={18} />
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="p-3 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <button 
                onClick={onOpenLogin}
                className="text-slate-900 font-bold hover:text-blue-600 transition-colors text-[15px]"
              >
                Sign In
              </button>
              <button
                onClick={onOpenLogin}
                className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95 overflow-hidden"
              >
                <span>Get Started</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600 bg-slate-50 rounded-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-[60] md:hidden transition-all duration-500 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-black text-slate-900">CarePulse</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-50 rounded-xl">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col gap-8">
            {[
              { name: 'Product', path: '/product' },
              { name: 'Solutions', path: '/solutions' },
              { name: 'Pricing', path: '/pricing' },
              { name: 'Resources', path: '/resources' }
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className="text-4xl font-black text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4">
            {user ? (
              <>
                <Link 
                  to={`/${role}`}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-center text-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="py-4 text-red-500 font-bold text-xl">Sign Out</button>
              </>
            ) : (
              <button
                onClick={() => { onOpenLogin(); setIsMenuOpen(false); }}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
