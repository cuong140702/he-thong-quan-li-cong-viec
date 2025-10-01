export interface IBodyMessage {
  senderId: string;
  receiverId: string;
  content: string;
}

export interface IGetMessageBetweenRes {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead?: boolean;
  createdAt?: Date;
  type?: "text" | "image" | "file";
}

export interface IGetUserMessage {
  id: string;
  email: string;
  fullName: string;
  isOnline: boolean;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl: string | null;
  deletedAt: string | null;
  lastSeen: Date | null;
}

export interface IQueryBetween {
  user1: string;
  user2: string;
}
