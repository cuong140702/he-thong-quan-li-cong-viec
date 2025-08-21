import { TaskStatus } from "../enum/task";
import { IGetTagsResponse } from "./tag";

export interface ITaskRes {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  deadline?: Date | null;
  projectId?: string | null;
  tags: IGetTagsResponse;
}

export interface IBodyTask {
  title: string;
  description?: string | null;
  status: TaskStatus.break | TaskStatus.completed | TaskStatus.in_progress;
  deadline?: Date | null;
  projectId?: string | null;
  tags: string[];
}
