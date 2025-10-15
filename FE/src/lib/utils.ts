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
import {
  Briefcase,
  Building,
  ClipboardList,
  Key,
  Shield,
  User,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { IPermissionsRes, Permission } from "@/utils/interface/permission";
import React, { ReactNode } from "react";
import { useAppContext } from "@/components/app-context";
import { TaskStatus } from "@/utils/enum/task";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

export const getUserAvatarFromLocalStorage = (id: string) =>
  isBrowser ? localStorage.getItem(`userAvatar_${id}`) : null;

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);

export const setUserAvatarToLocalStorage = (value: string, id: string) =>
  isBrowser && localStorage.setItem(`userAvatar_${id}`, value);

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
 * Format a date to "yyyy-MM-dd".
 * @param date - The date value (Date or string).
 * @returns Formatted date string or undefined if invalid.
 */
export function formatDate(
  date?: Date | string,
  pattern: string = "yyyy-MM-dd"
): string {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return ""; // tránh Invalid Date

  return format(parsedDate, pattern);
}

export function toDateSafe(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}

// 1. Role base mapping (giữ nguyên)
const baseRoleIcons: Record<string, React.ElementType> = {
  ADMIN: Shield,
  CLIENT: UserCog,
};

// 2. Danh sách icon cho role phát sinh
const iconList = [
  User,
  Users,
  UserCog,
  UserCheck,
  Shield,
  Key,
  Briefcase,
  Building,
  ClipboardList,
];

// 3. Hash string → number
function hashStringToNumber(str: string): number {
  return str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

// 4. Hàm lấy icon
export function getRoleIcon(role: string): React.ElementType {
  // Nếu role nằm trong baseRoleIcons thì return luôn
  if (baseRoleIcons[role]) {
    return baseRoleIcons[role];
  }

  // Nếu role khác → sinh icon ngẫu nhiên nhưng cố định
  const hash = hashStringToNumber(role.toUpperCase());
  const index = hash % iconList.length;
  return iconList[index];
}

export const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
  PATCH: "bg-purple-100 text-purple-700",
};

export const matchPath = (pattern: string, path: string) => {
  const regex = new RegExp("^" + pattern.replace(/:\w+/g, "\\w+") + "$");
  return regex.test(path);
};

export const hasPermission = (
  permissions: IPermissionsRes[] | undefined,
  module: Permission["module"],
  method: Permission["method"],
  path: string
) => {
  return (
    permissions &&
    permissions.length > 0 &&
    permissions.some(
      (p) =>
        p.module.toLocaleUpperCase() === module.toLocaleUpperCase() &&
        p.method.toLocaleUpperCase() === method.toLocaleUpperCase() &&
        matchPath(p.path, path)
    )
  );
};

export const ShowIfCan = ({
  module,
  method,
  path,
  children,
}: {
  module: Permission["module"];
  method: Permission["method"];
  path: string;
  children: ReactNode;
}) => {
  const { can } = useAppContext();

  if (!can(module, method, path)) return null;
  return React.createElement(React.Fragment, null, children);
};

export const formatDateTime = (date: Date | string) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy, HH:mm:ss");
};

export const colorMap: Record<TaskStatus, string> = {
  in_progress: "#3b82f6",
  completed: "#10b981",
  break: "#f59e0b",
};

export const handleGetDataTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
