import { TaskStatus } from "../enum/task";

export interface IGetClockInRes {
  startTime: Date;
  task: {
    title: string;
    status: TaskStatus.break | TaskStatus.completed | TaskStatus.in_progress;
  };
}

export interface IGetClockOutRes {
  endTime: Date;
  task: {
    title: string;
    status: TaskStatus.break | TaskStatus.completed | TaskStatus.in_progress;
  };
}

export interface ITimelog {
  id: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  note: string;
}

export interface IGetTotalByTaskRes {
  taskId: string;
  totalDurationMinutes: number;
  totalLogs: number;
}
