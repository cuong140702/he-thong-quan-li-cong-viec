export interface IGetRemindersResponse {
  id: string;
  isSent: boolean;
  remindAt: Date;
  deletedAt: Date | null;
  task?: {
    title: string;
    status: string;
  };
}

export interface IBodyReminder {
  taskId: string;
  remindAt: Date;
}
