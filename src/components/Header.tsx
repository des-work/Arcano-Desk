import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Library, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Sparkles,
  Zap
} from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'text-neon-purple' },
    { path: '/library', icon: Library, label: 'Library', color: 'text-neon-pink' },
    { path: '/calendar', icon: Calendar, label: 'Calendar', color: 'text-neon-cyan' },
    { path: '/assistant', icon: MessageSquare, label: 'Assistant', color: 'text-neon-green' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'text-neon-yellow' },
  ];

  return (
    <header className="bg-arcade-bg/90 backdrop-blur-sm border-b-2 border-neon-purple/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-neon-purple animate-pulse-neon group-hover:animate-spin" />
              <Zap className="w-4 h-4 text-neon-yellow absolute -top-1 -right-1 animate-bounce-slow" />
            </div>
            <div>
              <h1 className="text-2xl font-pixel text-transparent bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text neon-glow">
                ARCANO DESK
              </h1>
              <p className="text-xs text-neon-cyan/70 font-arcade">Magic Study Assistant</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label, color }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-arcade text-white neon-glow'
                      : 'text-gray-400 hover:text-white hover:bg-neon-purple/20'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : color} group-hover:animate-pulse`} />
                  <span className="font-arcade text-sm">{label}</span>
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-arcade opacity-20 animate-pulse-neon" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-neon-purple hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 space-y-2">
          {navItems.map(({ path, icon: Icon, label, color }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-arcade text-white neon-glow'
                    : 'text-gray-400 hover:text-white hover:bg-neon-purple/20'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : color}`} />
                <span className="font-arcade text-sm">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
