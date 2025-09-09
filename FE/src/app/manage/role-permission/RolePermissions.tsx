"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IRolesRes } from "@/utils/interface/role";
import { IPermissionsRes } from "@/utils/interface/permission";
import { IBodyUpdateRolePermissions } from "@/utils/interface/role";
import { methodColors } from "@/lib/utils";
import { toast } from "sonner";
import roleApiRequest from "@/apiRequests/role";
import { LoadingData } from "@/components/LoadingData";

interface RolePermissionsProps {
  role: IRolesRes | null;
  dataPermission: IPermissionsRes[];
  setPermissions: (perms: IPermissionsRes[]) => void;
}

export default function RolePermissions({
  role,
  dataPermission,
  setPermissions,
}: RolePermissionsProps) {
  const loadingContext = useContext(LoadingData);

  const { control, handleSubmit, reset, watch, formState } =
    useForm<IBodyUpdateRolePermissions>({
      defaultValues: { permissions: [] },
    });

  const permissionsValue = watch("permissions");

  useEffect(() => {
    if (role?.id) {
      getRolePermissions(role.id);
    }
  }, [role]);

  const getRolePermissions = async (id: string) => {
    try {
      loadingContext?.show();
      const res = await roleApiRequest.getRolePermissions(id);
      if (!res) return;
      const permissionIds = res.data?.permissions?.map((p: any) => p.id) ?? [];
      reset({ permissions: permissionIds });
    } catch {
      toast.error("Lỗi khi tải permissions của role!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleSavePermissions = handleSubmit(async (data) => {
    if (!role?.id) return;
    try {
      loadingContext?.show();
      await roleApiRequest.updateRolePermissions(role.id, {
        permissions: data.permissions,
      });
      toast.success("Cập nhật permissions thành công!");
      setPermissions(
        dataPermission.filter((p) => data.permissions.includes(p.id))
      );
      reset({ permissions: data.permissions });
    } catch {
      toast.error("Lỗi khi cập nhật permissions!");
    } finally {
      loadingContext?.hide();
    }
  });

  // Lấy danh sách module mà role đã có
  const modules = Array.from(
    new Set(dataPermission.map((p) => p.module))
  ).filter((m) =>
    dataPermission.some(
      (p) => p.module === m && permissionsValue?.includes(p.id)
    )
  );

  return (
    <Card className="col-span-9 shadow-md">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{role?.name ?? "Chưa chọn role"} Permissions</CardTitle>
        <Button
          onClick={handleSavePermissions}
          disabled={!formState.isDirty || !role}
          className="cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          Update Role Permission
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module) => (
          <div key={module} className="space-y-2">
            <h2 className="font-semibold text-gray-700">{module}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {dataPermission
                .filter((p) => p.module === module)
                .map((perm) => (
                  <div
                    key={perm.id}
                    className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50 transition-all"
                  >
                    <Controller
                      name="permissions"
                      control={control}
                      render={({ field }) => {
                        const checked = field.value?.includes(perm.id);
                        return (
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => {
                              const newValue = checked
                                ? field.value.filter((v) => v !== perm.id)
                                : [...field.value, perm.id];
                              field.onChange(newValue);
                            }}
                          />
                        );
                      }}
                    />
                    <span className="text-sm">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          methodColors[perm.method]
                        }`}
                      >
                        {perm.method}
                      </span>{" "}
                      {perm.path}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
