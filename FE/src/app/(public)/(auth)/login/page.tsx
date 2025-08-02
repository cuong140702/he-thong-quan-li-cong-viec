import React, { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
