"use client";

import { useForm } from "react-hook-form";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import mediaApiRequest from "@/apiRequests/media";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import userApiRequest from "@/apiRequests/user";
import { useAppContext } from "@/components/app-context";
import { IUpdateUser } from "@/utils/interface/user";
import { IQueryBase } from "@/utils/interface/common";
import { LoadingData } from "@/components/LoadingData";
import roleApiRequest from "@/apiRequests/role";
import { IRolesRes } from "@/utils/interface/role";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenPayload } from "@/utils/interface/auth";
import {
  getRefreshTokenFromLocalStorage,
  getUserAvatarFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  setUserAvatarToLocalStorage,
} from "@/lib/utils";
import authApiRequest from "@/apiRequests/auth";

export default function SettingsPage() {
  const loadingContext = useContext(LoadingData);
  const tProfile = useTranslations("Profile");
  const tSecurity = useTranslations("Security");
  const tCommon = useTranslations("Common");
  const { dataUser, setDataUser } = useAppContext();
  const localAvatar = getUserAvatarFromLocalStorage(dataUser?.userId || "");

  const form = useForm<IUpdateUser>({
    defaultValues: {
      email: "",
      fullName: "",
      roleId: "",
      avatarUrl: "",
    },
  });

  const avatar = form.watch("avatarUrl");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [dataRoles, setDataRoles] = useState<IRolesRes[]>([]);

  useEffect(() => {
    getListRoles({ page: 1, limit: 1000 });
  }, []);

  useEffect(() => {
    if (dataUser && dataRoles.length > 0) {
      form.reset({
        fullName: dataUser.fullName,
        email: dataUser.email,
        roleId: dataUser.roleId,
        avatarUrl: localAvatar || "",
      });
    }
  }, [dataUser, form, dataRoles]);

  const previewAvatar = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : avatar),
    [avatarFile, avatar]
  );

  const onSubmit = async (data: IUpdateUser) => {
    const refreshToken = getRefreshTokenFromLocalStorage();
    let avatarUrl = previewAvatar;

    if (avatarFile) {
      const res = await mediaApiRequest.uploadFiles([avatarFile]);
      avatarUrl = res?.data?.[0]?.url ?? previewAvatar;
      setUserAvatarToLocalStorage(avatarUrl || "", dataUser?.userId || "");
    }

    if (!dataUser?.userId) return;
    const res = await userApiRequest.updateUser(dataUser?.userId, {
      ...data,
      avatarUrl,
      refreshToken: refreshToken || "",
    });

    const { id, ...rest } = res?.data as TokenPayload & {
      id: string;
      accessToken: string;
      refreshToken: string;
    };
    const dataUpdateUser: Omit<TokenPayload, "userId"> & {
      id: string;
      accessToken: string;
      refreshToken: string;
    } = {
      ...rest,
      id,
    };
    const updatedUser = {
      ...dataUpdateUser,
      userId: dataUpdateUser.id,
      accessToken: dataUpdateUser.accessToken,
      refreshToken: dataUpdateUser.refreshToken,
    };

    setDataUser(updatedUser);
    setAccessTokenToLocalStorage(updatedUser.accessToken);
    setRefreshTokenToLocalStorage(updatedUser.refreshToken);
    await authApiRequest.setTokenToCookie({
      accessToken: updatedUser.accessToken,
      refreshToken: updatedUser.refreshToken,
    });
  };

  const getListRoles = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await roleApiRequest.list(payload);
      if (!res) return;

      const responseData = res.data;
      setDataRoles(responseData?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* Hồ sơ cá nhân */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <AvatarImage src={previewAvatar} alt="Avatar" />
                    <AvatarFallback>NV</AvatarFallback>
                  </Avatar>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {tProfile("changeAvatar")}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setAvatarFile(file);
                        form.setValue("avatarUrl", URL.createObjectURL(file), {
                          shouldDirty: true,
                        });
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {tProfile("avatarHint")}
                  </p>
                </div>

                {/* Form fields */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tProfile("name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tProfile("email")}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Name</FormLabel>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataRoles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-8">
                <Button variant="ghost" type="button">
                  {tCommon("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={dataUser?.userId ? !form.formState.isDirty : false}
                >
                  {tCommon("saveChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      {/* Bảo mật */}
      {/* <Card className="shadow-md border rounded-2xl">
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
      </Card> */}
    </div>
  );
}
