import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface DashboardProps {
  tasks: Task[];
  onStart: (taskId: string) => void;
  onPause: (taskId:string) => void;
  onResume: (taskId: string) => void;
  onFinalize: (taskId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onStart, onPause, onResume, onFinalize }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-gray-500">No Ingest Tasks</h2>
        <p className="mt-4 text-gray-400">Create a new task or use the AI suggestion feature to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {tasks.map(task => (
        <TaskCard 
          key={task.id}
          task={task}
          onStart={onStart}
          onPause={onPause}
          onResume={onResume}
          onFinalize={onFinalize}
        />
      ))}
    </div>
  );
};

export default Dashboard;
