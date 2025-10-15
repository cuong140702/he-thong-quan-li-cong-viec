import { TaskStatus } from "../enum/task";

export interface ITaskRes {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  deadline?: Date;
  projectId?: string | null;
  tags: string[];
}

export interface IBodyTask {
  title: string;
  description?: string | null;
  status: TaskStatus.break | TaskStatus.completed | TaskStatus.in_progress;
  startDate: Date;
  deadline: Date;
  projectId?: string | null;
  tags: string[];
  timeZone?: string;
}

export interface IQueryCalendar {
  startDate: Date;
  deadline: Date;
  projectId?: string;
  timeZone?: string;
}

export interface IGetCalendarRes {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date | null;
  deadline: Date | null;
  status: TaskStatus.break | TaskStatus.completed | TaskStatus.in_progress;
  projectId?: string | null;
  userId?: string;
  backgroundColor: string;
}
