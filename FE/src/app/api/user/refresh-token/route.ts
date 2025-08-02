import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json(
      {
        message: "Không tìm thấy refreshToken",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { data } = await authApiRequest.sRefreshToken({
      refreshToken: refreshToken as string,
    });

    const decodedAccessToken = jwt.decode(data?.accessToken as string) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(data?.refreshToken as string) as {
      exp: number;
    };

    cookieStore.set("accessToken", data?.accessToken as string, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", data?.refreshToken as string, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(
      {
        data,
        statusCode: 201,
        message: "Refresh token thành công",
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ?? "Có lỗi xảy ra",
      },
      {
        status: 401,
      }
    );
  }
}
