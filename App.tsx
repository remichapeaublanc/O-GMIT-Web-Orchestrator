import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import useTaskManager from './hooks/useTaskManager';
import { suggestTaskDetails } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';

export default function App() {
  const { 
    tasks, 
    addTask, 
    startTask, 
    pauseTask, 
    resumeTask, 
    finalizeTask 
  } = useTaskManager();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestTask = async () => {
    if (!prompt.trim()) return;
    setIsLoadingSuggestion(true);
    setError(null);
    try {
      const details = await suggestTaskDetails(prompt);
      if (details) {
        addTask(details.cameramanName, details.sourcePath, details.destinationPath);
        setIsModalOpen(false);
        setPrompt('');
      } else {
        setError('Failed to get suggestions. The model returned an empty response.');
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while fetching suggestions from the AI.');
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const AiSuggestionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2" />
            Suggest Task with AI
          </h2>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <p className="text-gray-400 mb-4">Describe the media project, and the AI will suggest task details for you.</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Drone footage from the Alps shoot, Day 3'"
          className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 mb-4 h-28 resize-none"
          disabled={isLoadingSuggestion}
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="flex justify-end gap-4">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition duration-200"
            disabled={isLoadingSuggestion}
          >
            Cancel
          </button>
          <button 
            onClick={handleSuggestTask}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md font-semibold flex items-center justify-center transition duration-200 disabled:bg-cyan-800 disabled:cursor-not-allowed"
            disabled={isLoadingSuggestion || !prompt.trim()}
          >
            {isLoadingSuggestion ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header onSuggestTask={() => setIsModalOpen(true)} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Dashboard 
          tasks={tasks}
          onStart={startTask}
          onPause={pauseTask}
          onResume={resumeTask}
          onFinalize={finalizeTask}
        />
      </main>
      {isModalOpen && <AiSuggestionModal />}
    </div>
  );
}
