export enum TaskStatus {
  READY = 'READY',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  ERROR = 'ERROR',
  COMPLETED = 'COMPLETED',
  FINALIZING = 'FINALIZING',
  DONE = 'DONE',
}

export interface Task {
  id: string;
  cameramanName: string;
  sourcePath: string;
  destinationPath: string;
  status: TaskStatus;
  rsyncPid: number | null;
  filesCopied: number;
  totalFiles: number;
  lastUpdate: string;
  progress: number;
}
