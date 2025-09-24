import { Suspense } from "react";
import SettingsPage from "./settingPage";
import { setRequestLocale } from "next-intl/server";

export default async function Settings(
  props: Readonly<{
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <SettingsPage />
    </Suspense>
  );
}
