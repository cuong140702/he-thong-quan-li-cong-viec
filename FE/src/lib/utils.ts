import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { TokenPayload } from "@/utils/interface/auth";
import authApiRequest from "@/apiRequests/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;
export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refreshToken", value);
export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("refreshToken");
};

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();

  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);
  console.log(decodedRefreshToken.exp);

  const now = new Date().getTime() / 1000 - 1;

  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return param?.onError && param.onError();
  }

  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.refreshToken();

      setAccessTokenToLocalStorage(res?.data?.accessToken as string);
      setRefreshTokenToLocalStorage(res?.data?.refreshToken as string);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};

export function formatRelativeTime(date: string | Date) {
  if (!date) return "";

  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000); // giây

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return d.toLocaleString(); // hoặc format theo bạn muốn
}
