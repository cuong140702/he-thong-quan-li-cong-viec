import { http } from "@/utils/api";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/utils/interface/auth";

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    statusCode: number;
    data: RefreshTokenResType;
  }> | null,
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType, LoginBodyType>("/user/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/user/login", body, {
      baseUrl: "",
    }),

  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/user/refresh-token", body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }

    const request = http
      .post<RefreshTokenResType, null>("/api/user/refresh-token", null, {
        baseUrl: "",
      })
      .then((res) => ({
        statusCode: res.statusCode,
        data: res.data as RefreshTokenResType,
        message: res.message,
      }));

    this.refreshTokenRequest = request;

    const result = await request;
    this.refreshTokenRequest = null;
    return result;
  },
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post(
      "/user/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  logout: () => http.post("/api/user/logout", null, { baseUrl: "" }),
};

export default authApiRequest;
