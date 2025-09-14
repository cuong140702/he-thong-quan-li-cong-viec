import React, { Suspense } from "react";
import RolePermissionPage from "./role-permission";

export default function RolePermission() {
  return (
    <Suspense>
      <RolePermissionPage />
    </Suspense>
  );
}
