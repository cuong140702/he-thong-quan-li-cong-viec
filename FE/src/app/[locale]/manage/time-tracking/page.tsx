import React, { Suspense } from "react";
import TimeTracking from "./time-tracking";
import { setRequestLocale } from "next-intl/server";

export default async function TimeTrackingPage(
  props: Readonly<{
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return (
    <Suspense>
      <TimeTracking />
    </Suspense>
  );
}
