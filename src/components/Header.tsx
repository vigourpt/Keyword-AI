import React, { useState } from 'react';
import { Brain, Search, Wrench, HelpCircle, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('hero')}>
            <Brain className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">KeywordAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              icon={<Search className="h-4 w-4" />} 
              text="Analyze Keywords" 
              onClick={() => scrollToSection('keyword-analyzer')}
            />
            <NavLink 
              icon={<Wrench className="h-4 w-4" />} 
              text="Generate Tools" 
              onClick={() => scrollToSection('features')}
            />
            <NavLink 
              icon={<HelpCircle className="h-4 w-4" />} 
              text="Help" 
              onClick={() => scrollToSection('cta')}
            />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <MobileNavLink 
              icon={<Search className="h-4 w-4" />} 
              text="Analyze Keywords" 
              onClick={() => scrollToSection('keyword-analyzer')}
            />
            <MobileNavLink 
              icon={<Wrench className="h-4 w-4" />} 
              text="Generate Tools" 
              onClick={() => scrollToSection('features')}
            />
            <MobileNavLink 
              icon={<HelpCircle className="h-4 w-4" />} 
              text="Help" 
              onClick={() => scrollToSection('cta')}
            />
          </div>
        )}
      </nav>
    </header>
  );
};

const NavLink = ({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
  >
    {icon}
    <span className="ml-2">{text}</span>
  </button>
);

const MobileNavLink = ({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-50"
  >
    {icon}
    <span className="ml-2">{text}</span>
  </button>
);

export default Header;