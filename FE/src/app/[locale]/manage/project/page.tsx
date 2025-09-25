import React, { Suspense } from "react";
import ProjectTable from "./projectTable";
import { setRequestLocale } from "next-intl/server";

export default async function Project(
  props: Readonly<{
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return (
    <Suspense>
      <ProjectTable />
    </Suspense>
  );
}
