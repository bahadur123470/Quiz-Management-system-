import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, GraduationCap, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-slate-950/20 backdrop-blur-md border-b border-white/5"
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
          <GraduationCap className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          QMS Pro
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          to={role === 'Instructor' ? '/instructor' : '/student'}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
