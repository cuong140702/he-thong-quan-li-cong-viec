import React, { Suspense } from "react";
import UserTable from "./userTable";
import { setRequestLocale } from "next-intl/server";

export default async function User(
  props: Readonly<{
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return (
    <Suspense>
      <UserTable />
    </Suspense>
  );
}
