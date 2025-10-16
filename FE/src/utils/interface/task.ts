import { TaskStatus } from "../enum/task";
import { IGetUserRes } from "./user";

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
  status: TaskStatus.BREAK | TaskStatus.COMPLETED | TaskStatus.IN_PROGRESS;
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
  status: TaskStatus.BREAK | TaskStatus.COMPLETED | TaskStatus.IN_PROGRESS;
  projectId?: string | null;
  userId?: string;
  backgroundColor: string;
}

export interface IGetCalendarDetail extends ITaskRes {
  user: Pick<IGetUserRes, "id" | "fullName">;
}
