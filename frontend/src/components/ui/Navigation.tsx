import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Workflows', path: '/workflows' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'Documents', path: '/documents' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-white border-b border-light-grey">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-navy-darkest">STELLA</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-navy-dark hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Quick Start Button */}
          <div className="flex items-center space-x-4">
            <Link to="/quick-start">
              <Button variant="primary">Quick Start</Button>
            </Link>
            <button className="p-2 text-navy-dark hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
