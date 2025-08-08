import queryString from "query-string";
import {
  getAccessTokenFromLocalStorage,
  normalizePath,
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { redirect } from "next/navigation";

let clientLogoutRequest: null | Promise<any> = null;
const customFetch = async <T>(
  url: string,
  method: string,
  options: Omit<IRequest, "url" | "method"> & {
    baseUrl?: string;
  }
): Promise<IBackendRes<T>> => {
  const { queryParams = {}, nextOption = {}, body } = options;

  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const normalizedPath = normalizePath(url);

  const fullUrl =
    Object.keys(queryParams).length > 0
      ? `${baseUrl}/${normalizedPath}?${queryString.stringify(queryParams)}`
      : `${baseUrl}/${normalizedPath}`;

  const isClient = typeof window !== "undefined";

  const baseHeaders: {
    [key: string]: string;
  } = body instanceof FormData ? {} : { "Content-Type": "application/json" };

  if (isClient) {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  const res = await fetch(fullUrl, {
    method,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...nextOption,
  });

  const payload = await res.json();

  const data = {
    statusCode: payload.statusCode,
    data: payload.data as T,
    message: payload?.message ?? "Success",
  };

  if (!res.ok) {
    // return {
    //   statusCode: payload.statusCode,
    //   message: payload?.message ?? "Something went wrong",
    //   error: payload?.error ?? "",
    // };
    if (res.status === 401) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/user/logout", {
            method: "POST",
            body: null,
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
          } finally {
            removeTokensFromLocalStorage();
            clientLogoutRequest = null;
            location.href = "/login";
          }
        }
      } else {
        // Đây là trường hợp khi mà chúng ta vẫn còn access token (còn hạn)
        // Và chúng ta gọi API ở Next.js Server (Route Handler , Server Component) đến Server Backend
        const accessToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    }
  }

  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (["api/user/login"].includes(normalizeUrl)) {
      const { accessToken, refreshToken } = data.data as any;
      setAccessTokenToLocalStorage(accessToken);
      setRefreshTokenToLocalStorage(refreshToken);
    }
  }
  return data;
};

export const http = {
  get: <T>(url: string, options?: Omit<IRequest, "body" | "method" | "url">) =>
    customFetch<T>(url, "GET", options ?? {}),

  post: <
    T,
    B extends Record<string, any> | null | FormData = Record<string, any>
  >(
    url: string,
    body: B,
    options?: Omit<IRequest, "url" | "method"> & {
      baseUrl?: string;
    }
  ) => customFetch<T>(url, "POST", { ...options, body }),

  put: <
    T,
    B extends Record<string, any> | null | FormData = Record<string, any>
  >(
    url: string,
    body: B,
    options?: Omit<IRequest, "url" | "method"> & {
      baseUrl?: string;
    }
  ) => customFetch<T>(url, "PUT", { ...options, body }),

  delete: <T>(url: string, options?: Omit<IRequest, "body">) =>
    customFetch<T>(url, "DELETE", options ?? {}),
};
