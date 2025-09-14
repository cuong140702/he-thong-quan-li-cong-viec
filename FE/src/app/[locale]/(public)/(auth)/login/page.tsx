import React from "react";
import { LoginForm } from "./login-form";
import LogoutPage from "./logout";
import { setRequestLocale } from "next-intl/server";

export default async function Login(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
      <LogoutPage />
    </div>
  );
}
