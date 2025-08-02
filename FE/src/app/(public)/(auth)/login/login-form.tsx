"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginBodyType } from "@/utils/interface/auth";
import authApiRequest from "@/apiRequests/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { removeTokensFromLocalStorage } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const clearTokens = searchParams?.get("clearTokens");

  useEffect(() => {
    if (clearTokens) {
      removeTokensFromLocalStorage();
    }
  }, [clearTokens]);

  const onSubmit = async (data: LoginBodyType) => {
    try {
      const result = await authApiRequest.login(data);
      router.push("/manage");
    } catch (error: any) {
      console.log("Login failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-[400px] mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full cursor-pointer">
              Đăng nhập
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
