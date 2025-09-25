import React, { Suspense } from "react";
import TagTable from "./tagTable";
import { setRequestLocale } from "next-intl/server";

export default async function Tag(
  props: Readonly<{
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return (
    <Suspense>
      <TagTable />
    </Suspense>
  );
}
