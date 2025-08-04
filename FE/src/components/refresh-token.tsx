"use client";

import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

// Những page sau sẽ không check refesh token
const UNAUTHENTICATED_PATH = ["/login"];
export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) {
      return;
    }
    let interval: any = null;
    const onRefreshToken = () =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
      });

    onRefreshToken();

    const TIMEOUT = 1000;
    interval = setInterval(onRefreshToken, TIMEOUT);

    return () => {
      clearInterval(interval);
    };
  }, [pathname, router]);
  return null;
}
