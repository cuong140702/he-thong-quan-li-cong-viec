export interface LoginBodyType {
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginResType {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface TokenPayload {
  email: string;
  exp: number;
  fullName: string;
  iat: number;
  roleId: string;
  roleName: string;
  userId: string;
  uuid: string;
}

export interface RefreshTokenResType extends LoginResType {}

export interface RefreshTokenBodyType {
  refreshToken: string;
}

export interface LogoutBodyType {
  refreshToken: string;
}
