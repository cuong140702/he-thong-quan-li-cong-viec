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
  deadline: Date;
  projectId?: string | null;
  tags: string[];
}
