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

export interface ICreateUser {
  email: string;
  password: string;
  roleId: string;
  fullName: string;
  avatarUrl?: string;
}

export type IUserDetailRes = Pick<
  IGetUserRes,
  "roleId" | "email" | "fullName"
> & {
  password: string;
};

export type IUpdateUser = Omit<ICreateUser, "password"> & {
  refreshToken?: string; // optional
};
