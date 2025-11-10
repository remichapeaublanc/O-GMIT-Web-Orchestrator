import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
    onSuggestTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSuggestTask }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-cyan-400">O-GMIT</span> Web Orchestrator
            </h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={onSuggestTask}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors duration-200"
            >
              <SparklesIcon className="w-5 h-5" />
              Suggest Task with AI
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
