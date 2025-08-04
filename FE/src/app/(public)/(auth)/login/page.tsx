import React, { Suspense } from "react";
import { LoginForm } from "./login-form";
import LogoutPage from "./logout";

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense>
        <LoginForm />
        <LogoutPage />
      </Suspense>
    </div>
  );
}
