import React, { Suspense } from "react";
import TaskTable from "./taskTable";
import { setRequestLocale } from "next-intl/server";

export default async function Task(
  props: Readonly<{
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return (
    <Suspense>
      <TaskTable />
    </Suspense>
  );
}
