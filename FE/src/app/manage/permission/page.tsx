"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Users, Shield, Briefcase, UserCog } from "lucide-react";

// Roles
const roles = [
  { name: "Admin", icon: Shield },
  { name: "Manager", icon: Briefcase },
  { name: "Staff", icon: UserCog },
  { name: "User", icon: Users },
];

// Permissions
const permissions = [
  { id: "view_users", method: "GET", path: "/users", module: "User" },
  { id: "create_users", method: "POST", path: "/users", module: "User" },
  { id: "edit_users", method: "PUT", path: "/users/:id", module: "User" },
  { id: "delete_users", method: "DELETE", path: "/users/:id", module: "User" },
  { id: "view_tasks", method: "GET", path: "/tasks", module: "Task" },
  { id: "create_tasks", method: "POST", path: "/tasks", module: "Task" },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function RolePermissionPage() {
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [rolePermissions, setRolePermissions] = useState<
    Record<string, string[]>
  >({
    Admin: permissions.map((p) => p.id),
    Manager: ["view_users", "view_tasks"],
    Staff: ["view_tasks"],
    User: ["view_tasks"],
  });

  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const togglePermission = (role: string, permId: string) => {
    setRolePermissions((prev) => {
      const current = prev[role] || [];
      const updated = current.includes(permId)
        ? current.filter((p) => p !== permId)
        : [...current, permId];
      return { ...prev, [role]: updated };
    });
  };

  const filteredPermissions = useMemo(() => {
    if (!search) return permissions;
    return permissions.filter(
      (p) =>
        p.module.toLowerCase().includes(search.toLowerCase()) ||
        p.path.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const columns = useMemo<ColumnDef<(typeof permissions)[0]>[]>(
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
          ></span>
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

  return (
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
                <Button size="sm" className="bg-[#04A7EB] hover:bg-muted/50">
                  + Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div
                      key={role.name}
                      onClick={() => setSelectedRole(role.name)}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                        selectedRole === role.name
                          ? "bg-[#04A7EB] text-white shadow"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <role.icon className="w-4 h-4" />
                      {role.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Role Permissions */}
            <Card className="col-span-9 shadow-md">
              <CardHeader>
                <CardTitle>{selectedRole} Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["User", "Task"].map((module) => (
                  <div key={module} className="space-y-2">
                    <h2 className="font-semibold text-gray-700">{module}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions
                        .filter((p) => p.module === module)
                        .map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50 transition-all"
                          >
                            <Checkbox
                              checked={rolePermissions[selectedRole]?.includes(
                                perm.id
                              )}
                              onCheckedChange={() =>
                                togglePermission(selectedRole, perm.id)
                              }
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
    </div>
  );
}
