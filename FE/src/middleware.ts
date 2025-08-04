import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const managePaths = ["/manage"];
const privatePaths = [...managePaths];
const unAuthPaths = ["/login"];
const loginPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  // pathname: /manage/dashboard
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // 1. Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // 2. Trường hợp đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/manage", request.url));
    }

    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      if (
        loginPaths.some((path) => pathname.startsWith(path)) &&
        searchParams.get("accessToken")
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/manage", request.url));
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
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
