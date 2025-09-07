"use client";

import { useState, useMemo, useContext, useEffect, createContext } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useForm, Controller } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { LoadingData } from "@/components/LoadingData";
import roleApiRequest from "@/apiRequests/role";
import { IQueryBase } from "@/utils/interface/common";
import { IBodyUpdateRolePermissions, IRolesRes } from "@/utils/interface/role";
import { toast } from "sonner";
import { methodColors, getRoleIcon } from "@/lib/utils";
import { IPermissionsRes } from "@/utils/interface/permission";
import permissionsApiRequest from "@/apiRequests/permission";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/components/app-context";
import FormRole from "./formRole";

export const TableContext = createContext({
  setTableIdEdit: (_: string) => {},
  tableIdEdit: "",
  tableIdDelete: "",
  setTableIdDelete: (_: string) => {},
  setIsOpen: (_: boolean) => {},
  isOpen: false,
  isRefreshList: false,
  setIsRefreshList: (_: boolean) => {},
});

export default function RolePermissionPage() {
  const { setPermissions } = useAppContext();
  const searchParams = useSearchParams();
  const roleId = useMemo(() => searchParams.get("roleId"), [searchParams]);
  const router = useRouter();
  const loadingContext = useContext(LoadingData);
  const [tableIdEdit, setTableIdEdit] = useState<string>("");
  const [tableIdDelete, setTableIdDelete] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRefreshList, setIsRefreshList] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [dataRole, setDataRole] = useState<IRolesRes[]>([]);
  const [dataPermission, setDataPermission] = useState<IPermissionsRes[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { control, handleSubmit, reset, watch, formState } =
    useForm<IBodyUpdateRolePermissions>({
      defaultValues: { permissions: [] },
    });

  const permissionsValue = watch("permissions");

  useEffect(() => {
    getListRole({ page: 1, limit: 1000 });
    handleGetAllPermissions({ page: 1, limit: 1000 });
  }, []);

  useEffect(() => {
    if (isRefreshList) {
      getListRole({ page: 1, limit: 1000 });
      setIsRefreshList(false);
    }
  }, [isRefreshList]);

  useEffect(() => {
    if (roleId && dataRole.length > 0) {
      const role = dataRole.find((r) => r.id === roleId);
      if (role) {
        handleSeSelectedRole(role);
      }
    }
  }, [dataRole]);

  const handleGetAllPermissions = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await permissionsApiRequest.list(payload);
      if (!res) return;
      setDataPermission(res.data?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleSeSelectedRole = (role: IRolesRes) => {
    setSelectedRoleId(role.id);
    setSelectedRole(role.name);
    router.push(`?roleId=${role.id}`);
    getRolePermissions(role.id);
  };

  const getListRole = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await roleApiRequest.list(payload);
      if (!res) return;
      setDataRole(res.data?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const getRolePermissions = async (id: string) => {
    try {
      if (!id) return;
      loadingContext?.show();
      const res = await roleApiRequest.getRolePermissions(id);
      if (!res) return;

      const permissionIds = res.data?.permissions?.map((p: any) => p.id) ?? [];

      reset({ permissions: permissionIds });
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const filteredPermissions = useMemo(() => {
    if (!search) return dataPermission;
    return dataPermission.filter(
      (p) =>
        p.module.toLowerCase().includes(search.toLowerCase()) ||
        p.path.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, dataPermission]);

  const columns = useMemo<ColumnDef<(typeof dataPermission)[0]>[]>(
    () => [
      {
        accessorKey: "module",
        header: "Module",
      },
      {
        accessorKey: "method",
        header: "Method",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              methodColors[info.getValue() as string]
            }`}
          >
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "path",
        header: "Path",
      },
      {
        accessorKey: "id",
        header: "Actions",
        cell: () => (
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-[#04A7EB] hover:text-white"
          >
            Edit
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredPermissions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const modules = useMemo(() => {
    const permsOfRole = permissionsValue || [];
    const allModules = Array.from(new Set(dataPermission.map((p) => p.module)));
    return allModules.filter((m) =>
      dataPermission.some((p) => p.module === m && permsOfRole.includes(p.id))
    );
  }, [permissionsValue, dataPermission]);

  const handleSavePermissions = handleSubmit(async (data) => {
    if (!selectedRoleId) return;
    try {
      loadingContext?.show();
      await roleApiRequest.updateRolePermissions(selectedRoleId, {
        permissions: data.permissions,
      });
      toast.success("Cập nhật permissions thành công!");
      setPermissions(
        dataPermission.filter((p) => data.permissions.includes(p.id))
      );
      reset({ permissions: data.permissions });
    } catch (error) {
      toast.error("Lỗi khi cập nhật permissions!");
    } finally {
      loadingContext?.hide();
    }
  });

  return (
    <TableContext.Provider
      value={{
        tableIdEdit,
        setTableIdEdit,
        tableIdDelete,
        setTableIdDelete,
        isOpen,
        setIsOpen,
        isRefreshList,
        setIsRefreshList,
      }}
    >
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Role & Permission Management</h1>

        <Tabs defaultValue="roles">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          {/* -------------------- ROLES TAB -------------------- */}
          <TabsContent value="roles" className="mt-4">
            <div className="grid grid-cols-12 gap-6">
              {/* Sidebar Roles */}
              <Card className="col-span-3 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Roles</CardTitle>
                  <Button
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dataRole.map((role) => {
                      const Icon = getRoleIcon(role.name);
                      return (
                        <div
                          key={role.id}
                          onClick={() => handleSeSelectedRole(role)}
                          className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                            selectedRole === role.name
                              ? "bg-[#04A7EB] text-white shadow"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          {/* Left side: icon + name */}
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="w-4 h-4" />}
                            <span>{role.name}</span>
                          </div>

                          {/* Right side: actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 p-0 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTableIdEdit(role.id);
                                setIsOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Role Permissions */}
              <Card className="col-span-9 shadow-md">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>{selectedRole} Permissions</CardTitle>
                  <Button
                    onClick={handleSavePermissions}
                    disabled={!formState.isDirty}
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
                                  const checked = field.value?.includes(
                                    perm.id
                                  );
                                  return (
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={() => {
                                        const newValue = checked
                                          ? field.value.filter(
                                              (v) => v !== perm.id
                                            )
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
                                </span>
                                {perm.path}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* -------------------- PERMISSIONS TAB -------------------- */}
          <TabsContent value="permissions" className="mt-4">
            <div className="mb-4 flex justify-between items-center">
              <Input
                placeholder="Search by module or path..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Button className="bg-[#04A7EB] hover:bg-muted/50">
                + Add Permission
              </Button>
            </div>

            <Card className="shadow-md">
              <CardContent>
                <table className="w-full border-collapse rounded-md overflow-hidden">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="bg-gray-100 text-left text-gray-700"
                      >
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="p-3 border cursor-pointer"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <span>
                              {header.column.getIsSorted() === "asc"
                                ? " 🔼"
                                : header.column.getIsSorted() === "desc"
                                ? " 🔽"
                                : ""}
                            </span>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-all"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-3 border">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <FormRole
          id={tableIdEdit}
          setId={setTableIdEdit}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </TableContext.Provider>
  );
}
