import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Hand,
  Sliders,
  Menu,
  X,
  Languages,
  MessageSquareText,
  History as HistoryIcon,
  HelpCircle,
  Settings as SettingsIcon,
  LayoutDashboard,
  Home,
  LogIn,
  LogOut,
  ChevronDown,
  UserCircle,
} from 'lucide-react';
import { AccessibilityModal } from '../accessibility/AccessibilityModal';
import { LanguageSelector } from '../common/LanguageSelector';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isA11yModalOpen, setIsA11yModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    user,
    logout,
  } = useApp();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/translate', label: 'Translate', icon: Languages },
    { to: '/conversation', label: 'Conversation', icon: MessageSquareText },
    { to: '/history', label: 'History', icon: HistoryIcon },
    { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const getUserInitials = (name?: string) => {
    return (name || 'User')
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSettings = () => {
    setIsUserMenuOpen(false);
    navigate('/settings');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4"
          aria-label="Main Navigation"
        >
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 focus:outline-hidden focus:ring-2 focus:ring-teal-500 rounded-xl p-1 group"
            id="nav-brand-logo"
            aria-label="SignBridge Home"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 group-hover:bg-teal-700 text-white flex items-center justify-center shadow-md shadow-teal-500/20 transition-all">
              <Hand className="w-6 h-6 transform group-hover:rotate-6 transition-transform" />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                SIGN<span className="text-teal-600">BRIDGE</span>
              </span>

              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 tracking-wide mt-0.5">
                Breaking barriers with AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector compact idPrefix="nav" />
            </div>

            {/* Accessibility */}
            <button
              type="button"
              onClick={() => setIsA11yModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-xs"
              aria-label="Open Accessibility settings"
              id="accessibility-quick-btn"
              title="Accessibility options"
            >
              <Sliders className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Accessibility</span>
            </button>

            {/* User Menu / Login */}
            {isAuthenticated ? (
              <div className="hidden md:block relative">

                {/* User Button */}
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 text-slate-700 transition-all focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  id="user-menu-btn"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  title="Open user menu"
                >
                  {/* User Initials Avatar */}
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {getUserInitials(user?.name)}
                  </div>

                  <span className="text-sm font-semibold max-w-[110px] truncate">
                    {user?.name || 'User'}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
                    role="menu"
                    id="user-menu-dropdown"
                  >
                    {/* User Information */}
                    <div className="px-4 py-4 bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center gap-3">

                        {/* Large User Initials Avatar */}
                        <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
                          {getUserInitials(user?.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {user?.name || 'User'}
                          </p>

                          <p className="text-xs text-slate-500 truncate">
                            {user?.email || 'Signed in'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Settings */}
                    <button
                      type="button"
                      onClick={handleSettings}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      role="menuitem"
                    >
                      <SettingsIcon className="w-4 h-4 text-slate-500" />
                      Settings
                    </button>

                    {/* Logout */}
                    <div className="border-t border-slate-100 p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        role="menuitem"
                        id="dropdown-logout-btn"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm items-center gap-2 transition-all"
                id="login-btn"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-2 focus:ring-teal-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 shadow-lg space-y-4 animate-in slide-in-from-top-2 duration-200"
            id="mobile-menu-dropdown"
          >
            <div className="space-y-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-teal-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Language Preferences
              </div>

              <LanguageSelector idPrefix="mobile-nav" />

              <button
                type="button"
                onClick={() => {
                  setIsA11yModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 font-semibold"
              >
                <Sliders className="w-5 h-5 text-teal-600" />
                Accessibility
              </button>

              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                        {getUserInitials(user?.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user?.name || 'User'}
                        </p>

                        <p className="text-xs text-slate-500 truncate">
                          {user?.email || 'Signed in'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsMobileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-50 font-semibold"
                  >
                    <SettingsIcon className="w-5 h-5" />
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-red-600 border border-red-300 hover:bg-red-50 hover:border-red-500 font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-600 text-white font-semibold"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Accessibility Modal */}
      <AccessibilityModal
        isOpen={isA11yModalOpen}
        onClose={() => setIsA11yModalOpen(false)}
      />
    </>
  );
};