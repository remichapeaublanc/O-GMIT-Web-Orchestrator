import React from 'react';
import { Task, TaskStatus } from '../types';
import ProgressBar from './ProgressBar';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { ResumeIcon } from './icons/ResumeIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ClockIcon } from './icons/ClockIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface TaskCardProps {
  task: Task;
  onStart: (taskId: string) => void;
  onPause: (taskId: string) => void;
  onResume: (taskId: string) => void;
  onFinalize: (taskId: string) => void;
}

const statusConfig = {
  [TaskStatus.READY]: { color: 'gray-500', icon: <ClockIcon className="w-5 h-5"/>, label: 'Ready' },
  [TaskStatus.RUNNING]: { color: 'blue-500', icon: <div className="w-5 h-5 flex items-center justify-center"><div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div></div>, label: 'Running' },
  [TaskStatus.PAUSED]: { color: 'yellow-500', icon: <PauseIcon className="w-5 h-5"/>, label: 'Paused' },
  [TaskStatus.ERROR]: { color: 'red-500', icon: <XCircleIcon className="w-5 h-5"/>, label: 'Error' },
  [TaskStatus.COMPLETED]: { color: 'green-500', icon: <CheckCircleIcon className="w-5 h-5"/>, label: 'Completed' },
  [TaskStatus.FINALIZING]: { color: 'indigo-500', icon: <div className="w-5 h-5 flex items-center justify-center"><svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg></div>, label: 'Finalizing (MHL)...' },
  [TaskStatus.DONE]: { color: 'teal-500', icon: <CheckCircleIcon className="w-5 h-5"/>, label: 'Done' }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onStart, onPause, onResume, onFinalize }) => {
  const { color, icon, label } = statusConfig[task.status];

  const renderActions = () => {
    switch (task.status) {
      case TaskStatus.READY:
        return <button onClick={() => onStart(task.id)} className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"><PlayIcon className="w-6 h-6" /></button>;
      case TaskStatus.RUNNING:
        return <button onClick={() => onPause(task.id)} className="p-2 rounded-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"><PauseIcon className="w-6 h-6" /></button>;
      case TaskStatus.PAUSED:
        return <button onClick={() => onResume(task.id)} className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"><ResumeIcon className="w-6 h-6" /></button>;
      case TaskStatus.COMPLETED:
         return <button onClick={() => onFinalize(task.id)} className="px-4 py-2 text-sm rounded-md bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors">Finalize Task</button>;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-5 border border-gray-700 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{task.cameramanName}</h3>
            <p className="text-xs text-gray-400">{task.id}</p>
          </div>
          <div className={`flex items-center gap-2 text-sm font-semibold text-${color}`}>
            {icon}
            <span>{label}</span>
          </div>
        </div>

        <div className="space-y-3 text-sm mb-4">
          <p className="text-gray-400 break-all"><span className="font-semibold text-gray-300">Source:</span> {task.sourcePath}</p>
          <p className="text-gray-400 break-all"><span className="font-semibold text-gray-300">Destination:</span> {task.destinationPath}</p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress ({task.filesCopied} / {task.totalFiles} files)</span>
            <span>{task.progress.toFixed(1)}%</span>
          </div>
          <ProgressBar progress={task.progress} />
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>
          {task.rsyncPid && <span>PID: {task.rsyncPid}</span>}
        </div>
        <div className="flex items-center gap-4">
           {renderActions()}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
