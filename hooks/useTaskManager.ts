import { useState, useRef, useCallback } from 'react';
import { Task, TaskStatus } from '../types';

const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const intervalRefs = useRef<Record<string, number>>({});

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates, lastUpdate: new Date().toISOString() } : task
      )
    );
  }, []);

  const addTask = useCallback((cameramanName: string, sourcePath: string, destinationPath: string) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      cameramanName,
      sourcePath,
      destinationPath,
      status: TaskStatus.READY,
      rsyncPid: null,
      filesCopied: 0,
      totalFiles: Math.floor(Math.random() * (1000 - 200 + 1) + 200),
      lastUpdate: new Date().toISOString(),
      progress: 0,
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const startTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== TaskStatus.READY) return;

    updateTask(taskId, { status: TaskStatus.RUNNING, rsyncPid: Math.floor(Math.random() * 90000) + 10000 });

    intervalRefs.current[taskId] = window.setInterval(() => {
      setTasks(prevTasks => {
        const currentTask = prevTasks.find(t => t.id === taskId);
        if (!currentTask || currentTask.status !== TaskStatus.RUNNING) {
          clearInterval(intervalRefs.current[taskId]);
          return prevTasks;
        }

        const filesIncrement = Math.floor(Math.random() * 5) + 1;
        const newFilesCopied = Math.min(currentTask.filesCopied + filesIncrement, currentTask.totalFiles);
        const newProgress = (newFilesCopied / currentTask.totalFiles) * 100;
        
        if (newProgress >= 100) {
          clearInterval(intervalRefs.current[taskId]);
          delete intervalRefs.current[taskId];
          return prevTasks.map(t => t.id === taskId ? { ...t, filesCopied: t.totalFiles, progress: 100, status: TaskStatus.COMPLETED, rsyncPid: null, lastUpdate: new Date().toISOString() } : t);
        }

        return prevTasks.map(t => t.id === taskId ? { ...t, filesCopied: newFilesCopied, progress: newProgress, lastUpdate: new Date().toISOString() } : t);
      });
    }, 500);
  }, [tasks, updateTask]);

  const pauseTask = useCallback((taskId: string) => {
    if (intervalRefs.current[taskId]) {
      clearInterval(intervalRefs.current[taskId]);
      delete intervalRefs.current[taskId];
    }
    updateTask(taskId, { status: TaskStatus.PAUSED });
  }, [updateTask]);
  
  const resumeTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== TaskStatus.PAUSED) return;

    updateTask(taskId, { status: TaskStatus.RUNNING });

    intervalRefs.current[taskId] = window.setInterval(() => {
      setTasks(prevTasks => {
        const currentTask = prevTasks.find(t => t.id === taskId);
        if (!currentTask || currentTask.status !== TaskStatus.RUNNING) {
          clearInterval(intervalRefs.current[taskId]);
          return prevTasks;
        }

        const filesIncrement = Math.floor(Math.random() * 5) + 1;
        const newFilesCopied = Math.min(currentTask.filesCopied + filesIncrement, currentTask.totalFiles);
        const newProgress = (newFilesCopied / currentTask.totalFiles) * 100;

        if (newProgress >= 100) {
          clearInterval(intervalRefs.current[taskId]);
          delete intervalRefs.current[taskId];
          return prevTasks.map(t => t.id === taskId ? { ...t, filesCopied: t.totalFiles, progress: 100, status: TaskStatus.COMPLETED, rsyncPid: null, lastUpdate: new Date().toISOString() } : t);
        }
        
        return prevTasks.map(t => t.id === taskId ? { ...t, filesCopied: newFilesCopied, progress: newProgress, lastUpdate: new Date().toISOString() } : t);
      });
    }, 500);
  }, [tasks, updateTask]);

  const finalizeTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== TaskStatus.COMPLETED) return;

    updateTask(taskId, { status: TaskStatus.FINALIZING });

    setTimeout(() => {
      // Simulate post-processing & symlink creation
      setTimeout(() => {
        updateTask(taskId, { status: TaskStatus.DONE });
      }, 1500);
    }, 2000); // Simulate MHL generation
  }, [tasks, updateTask]);
  
  return { tasks, addTask, startTask, pauseTask, resumeTask, finalizeTask };
};

export default useTaskManager;
