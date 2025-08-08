// types/notification.ts
export interface INotificationRes {
  id: string;
  title: string;
  content: string | null;
  isRead: boolean;
  createdAt: Date;
  userId: string;
  senderId: string | null;
}
