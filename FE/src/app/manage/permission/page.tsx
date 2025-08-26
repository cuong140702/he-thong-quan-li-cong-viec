import React, { Suspense } from "react";
import RolePermissionPage from "./rolePermission";

export default function RolePermission() {
  return (
    <Suspense>
      <RolePermissionPage />
    </Suspense>
  );
}
