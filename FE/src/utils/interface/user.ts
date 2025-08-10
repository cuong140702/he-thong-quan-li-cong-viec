export interface IRole {
  id: string;
  name: string;
}

export interface IGetUserRes {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isOnline: boolean;
  avatarUrl: string | null;
  lastSeen: string;
  role: IRole;
}
