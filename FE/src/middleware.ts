import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { defaultLocale } from "./i18n/config";

const managePaths = ["vi/manage", "en/manage"];
const privatePaths = [...managePaths];
const unAuthPaths = ["vi/login", "en/login"];
const loginPaths = ["vi/login", "en/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
  const { pathname, searchParams } = request.nextUrl;
  // pathname: /manage/dashboard
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;
  // 1. Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // 2. Trường hợp đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      if (
        loginPaths.some((path) => pathname.startsWith(path)) &&
        searchParams.get("accessToken")
      ) {
        return response;
      }
      return NextResponse.redirect(new URL(`/${locale}/manage`, request.url));
      // response.headers.set(
      //   'x-middleware-rewrite',
      //   new URL('/en', request.url).toString()
      // )
      // return response
    }

    // 2.2 Nhưng access token lại hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL(`/${locale}/refresh-token`, request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    //return NextResponse.next();
    return response;
  }
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage", "/(vi|en)/:path*"],
};
