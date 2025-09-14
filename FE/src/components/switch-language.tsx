"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function SwitchLanguage() {
  const t = useTranslations("SwitchLanguage");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        router.replace(pathname, {
          locale: value as Locale,
        });
        router.refresh();
      }}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={t("title")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((locale) => (
            <SelectItem value={locale} key={locale}>
              {t(locale)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
