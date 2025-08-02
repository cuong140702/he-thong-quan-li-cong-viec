"use client";
import authApiRequest from "@/apiRequests/auth";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

async function logoutRequest() {
  await authApiRequest.logout();
}

function Logout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  const ref = useRef<boolean>(false);

  useEffect(() => {
    if (
      !ref.current &&
      ((refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl &&
          accessTokenFromUrl === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = true;
      logoutRequest().then((res) => {
        setTimeout(() => {
          ref.current = false;
        }, 1000);
        router.push("/login");
      });
    } else {
      router.push("/manage");
    }
  }, [logoutRequest, router, refreshTokenFromUrl, accessTokenFromUrl]);

  return <div>Logging out...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  );
}
