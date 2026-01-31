import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';

export function Navigation() {
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/workflows', label: 'Workflows' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/documents', label: 'Documents' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <nav className="bg-white border-b border-navy/10">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo and Nav Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <h1 className="text-2xl font-bold text-navy">STELLA</h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue/10 text-blue'
                      : 'text-navy/70 hover:text-navy hover:bg-navy/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Quick Start + Notifications */}
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => (window.location.href = '/quick-start')}>
            🚀 Quick Start
          </Button>

          {/* Notification Bell */}
          <button className="p-2 rounded-md hover:bg-navy/5 transition-colors relative">
            <svg
              className="w-6 h-6 text-navy"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-button rounded-full"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
