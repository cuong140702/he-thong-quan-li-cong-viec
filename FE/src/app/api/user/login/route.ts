import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType, LoginResType } from "@/utils/interface/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = await cookies();
  try {
    const { data } = await authApiRequest.sLogin(body);
    const { accessToken, refreshToken } = data as LoginResType;
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };

    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(
      {
        data: data,
        statusCode: 201,
        message: "Login token thành công",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json({ message: "Login failed" }, { status: 401 });
  }
}
