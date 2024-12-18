import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wrench, Search, Settings } from 'lucide-react';

export const NavigationBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { path: '/analyze', icon: <Search className="w-5 h-5" />, label: 'Analyze Keywords' },
    { path: '/tools', icon: <Wrench className="w-5 h-5" />, label: 'Generate Tools' },
    { path: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="KeywordAI"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive(item.path)
                      ? 'border-b-2 border-purple-500 text-gray-900'
                      : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
