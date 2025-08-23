import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { TokenPayload } from "@/utils/interface/auth";
import authApiRequest from "@/apiRequests/auth";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isValid,
  parseISO,
} from "date-fns";

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

/**
 * Định dạng thời gian giống chat message
 * @param date - Ngày cần định dạng (string | Date)
 * @returns Chuỗi hiển thị
 */
export function formatMessageTime(date: string | Date): string {
  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d.getTime())) return ""; // invalid date

  if (isToday(d)) {
    return format(d, "HH:mm");
  }

  if (isYesterday(d)) {
    return `Yesterday, ${format(d, "HH:mm")}`;
  }

  if (isThisWeek(d)) {
    return `${format(d, "EEEE")}, ${format(d, "HH:mm")}`;
    // Ví dụ: "Monday, 14:32"
  }

  return format(d, "dd/MM/yyyy HH:mm");
}

/**
 * Định dạng ngày theo yyyy-MM-dd
 * @param date - Ngày cần định dạng (có thể là Date hoặc string)
 * @returns Chuỗi ngày đã định dạng hoặc undefined nếu không có date
 */
export function formatDate(date?: Date | string | null): string | undefined {
  if (!date) return undefined;

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return undefined; // kiểm tra invalid date

  return format(parsedDate, "yyyy-MM-dd");
}

export function toDateSafe(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}
