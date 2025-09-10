import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Library,
  Calendar,
  MessageSquare,
  Settings,
  Sparkles,
  Menu,
  X,
  Wand2,
  BookOpen,
  Crown,
  Flame
} from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: '🏰 Wizard Tower', color: 'text-purple-300', rune: 'A' },
    { path: '/library', icon: Library, label: '📚 Arcane Library', color: 'text-pink-300', rune: 'L' },
    { path: '/assistant', icon: MessageSquare, label: '🧙‍♂️ Mystic Oracle', color: 'text-cyan-300', rune: 'O' },
    { path: '/calendar', icon: Calendar, label: '📅 Quest Log', color: 'text-green-300', rune: 'Q' },
    { path: '/settings', icon: Settings, label: '⚙️ Enchanted Forge', color: 'text-yellow-300', rune: 'F' },
  ];

  return (
    <header className="bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-50 relative overflow-hidden">
      {/* Magical background particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-2 left-1/4 animate-float">
          <Sparkles className="w-3 h-3 text-yellow-400" />
        </div>
        <div className="absolute top-4 right-1/3 animate-float" style={{ animationDelay: '1s' }}>
          <Flame className="w-3 h-3 text-orange-400" />
        </div>
        <div className="absolute bottom-2 left-1/2 animate-float" style={{ animationDelay: '2s' }}>
          <Wand2 className="w-3 h-3 text-purple-400" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Wizard Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/50 border border-purple-300/30">
                <Crown className="w-7 h-7 text-white animate-pulse-gentle" />
              </div>
              {/* Magical aura */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 animate-magic-circle"></div>
            </div>
            <div>
              <h1 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 animate-fade-in group-hover:from-yellow-300 group-hover:via-orange-300 group-hover:to-red-300 transition-all duration-500">
                Arcano Desk
              </h1>
              <p className="text-sm text-purple-300/80 font-rune tracking-widest">✨ Mystical Study Companion ✨</p>
            </div>
          </Link>

          {/* Arcane Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, icon: Icon, label, color, rune }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-2xl shadow-purple-500/30 border border-purple-400/50'
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:shadow-xl hover:shadow-purple-500/20 border border-transparent hover:border-purple-400/30'
                  }`}
                >
                  {/* Rune symbol */}
                  <div className="relative">
                    <span className={`text-xs font-rune ${isActive ? 'text-yellow-300' : 'text-purple-400'} group-hover:scale-110 transition-transform duration-300`}>
                      {rune}
                    </span>
                    {isActive && (
                      <div className="absolute inset-0 bg-yellow-300/20 rounded-full animate-sparkle"></div>
                    )}
                  </div>

                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-200 animate-pulse' : color} group-hover:scale-110 transition-transform duration-300`} />
                  <span className="font-arcane text-sm font-medium group-hover:text-white transition-colors duration-300">{label}</span>

                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse-gentle" />
                  )}

                  {/* Hover magical effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              );
            })}
          </nav>

          {/* Mystic Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 text-purple-300 hover:text-yellow-300 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:scale-110 shadow-lg hover:shadow-purple-500/30 border border-purple-400/30"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 animate-wizard-wiggle" />
            ) : (
              <Wand2 className="w-6 h-6 animate-pulse-gentle" />
            )}
          </button>
        </div>

        {/* Mystic Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 space-y-3 animate-slide-in">
            <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/30 shadow-2xl relative overflow-hidden">
              {/* Magical background for mobile menu */}
              <div className="absolute top-2 right-4 animate-float">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="absolute bottom-2 left-4 animate-float" style={{ animationDelay: '1s' }}>
                <Flame className="w-3 h-3 text-orange-400" />
              </div>

              {navItems.map(({ path, icon: Icon, label, color, rune }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-500 block group relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-xl shadow-purple-500/30 border border-purple-400/50'
                        : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 border border-transparent hover:border-purple-400/30'
                    }`}
                  >
                    {/* Rune symbol */}
                    <div className="relative">
                      <span className={`text-sm font-rune ${isActive ? 'text-yellow-300' : 'text-purple-400'} group-hover:scale-110 transition-transform duration-300`}>
                        {rune}
                      </span>
                      {isActive && (
                        <div className="absolute inset-0 bg-yellow-300/20 rounded-full animate-sparkle"></div>
                      )}
                    </div>

                    <Icon className={`w-6 h-6 ${isActive ? 'text-purple-200 animate-pulse' : color} group-hover:scale-110 transition-transform duration-300`} />
                    <span className="font-arcane font-medium group-hover:text-white transition-colors duration-300">{label}</span>

                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse-gentle" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
