import { AppHeader } from "@/components/app.header";
import Sidebar from "@/components/sidebar";
import { setRequestLocale } from "next-intl/server";

export default async function ManageLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;
  setRequestLocale(locale);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-3 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
