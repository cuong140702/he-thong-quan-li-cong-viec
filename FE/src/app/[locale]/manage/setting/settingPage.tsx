"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  bio?: string;
  roleName: string;
  notifications: boolean;
  marketing: boolean;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export default function SettingsPage() {
  const tProfile = useTranslations("Profile");
  const tSecurity = useTranslations("Security");
  const tCommon = useTranslations("Common");
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      fullName: "Nguyễn Văn Cường",
      email: "cuong@gmail.com",
      phone: "0123456789",
      roleName: "",
      bio: "Front-end developer đam mê UX/UI ✨",
      notifications: true,
      marketing: false,
    },
  });

  const [saving, setSaving] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Saved", data);
    setSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* Hồ sơ cá nhân */}
      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle>{tProfile("title")}</CardTitle>
          <CardDescription>{tProfile("desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-28 h-28 border">
                <AvatarImage src="/avatar.png" alt="Avatar" />
                <AvatarFallback>NV</AvatarFallback>
              </Avatar>
              <Button variant="secondary" size="sm">
                {tProfile("changeAvatar")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {tProfile("avatarHint")}
              </p>
            </div>

            {/* Form thông tin */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-1 block">{tProfile("name")}</Label>
                <Input {...register("fullName")} />
              </div>
              <div>
                <Label className="mb-1 block">{tProfile("email")}</Label>
                <Input type="email" {...register("email")} />
              </div>
              <div>
                <Label className="mb-1 block">{tProfile("phone")}</Label>
                <Input {...register("phone")} />
              </div>
              <div>
                <Label className="mb-1 block">{tProfile("roleName")}</Label>
                <Input {...register("roleName")} />
              </div>
              <div className="md:col-span-2">
                <Label className="mb-1 block">Giới thiệu</Label>
                <Textarea {...register("bio")} className="min-h-[90px]" />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="ghost" type="button">
              {tCommon("cancel")}
            </Button>
            <Button type="submit">{tCommon("saveChanges")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Bảo mật */}
      <Card className="shadow-md border rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{tSecurity("title")}</CardTitle>
          <CardDescription className="text-sm">
            {tSecurity("desc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="mb-1 block">
                {tSecurity("currentPassword")}
              </Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                {...register("currentPassword")}
              />
            </div>

            <div>
              <Label className="mb-1 block">{tSecurity("newPassword")}</Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới"
                {...register("newPassword")}
              />
            </div>

            <div>
              <Label className="mb-1 block">
                {tSecurity("confirmPassword")}
              </Label>
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                {...register("confirmPassword")}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="default" className="px-6">
              {tSecurity("updatePassword")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
