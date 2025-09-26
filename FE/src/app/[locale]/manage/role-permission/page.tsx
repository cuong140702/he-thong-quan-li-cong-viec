import React, { Suspense } from "react";
import RolePermissionPage from "./role-permission";
import { setRequestLocale } from "next-intl/server";

export default async function RolePermission(
  props: Readonly<{
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return (
    <Suspense>
      <RolePermissionPage />
    </Suspense>
  );
}
