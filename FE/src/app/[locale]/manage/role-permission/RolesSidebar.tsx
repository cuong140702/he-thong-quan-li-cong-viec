"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IRolesRes } from "@/utils/interface/role";
import { getRoleIcon } from "@/lib/utils";
import { useContext } from "react";
import { TableContext } from "./role-permission";
import FormRole from "./formRole";
import DialogDelete from "@/components/ModalDelete";
import roleApiRequest from "@/apiRequests/role";
import { toast } from "sonner";

interface RolesSidebarProps {
  roles: IRolesRes[];
  selectedRole: IRolesRes | null;
  setSelectedRole: (role: IRolesRes) => void;
}

export default function RolesSidebar({
  roles,
  selectedRole,
  setSelectedRole,
}: RolesSidebarProps) {
  const {
    tableIdEdit,
    setTableIdEdit,
    tableIdDelete,
    setTableIdDelete,
    isOpen,
    setIsOpen,
    setIsRefreshList,
  } = useContext(TableContext);

  const handleDelete = async () => {
    if (!tableIdDelete) return;
    try {
      const res = await roleApiRequest.deleteRole(tableIdDelete);
      if (res.statusCode === 200) {
        toast.success("Xoá thành công!");
        setIsRefreshList(true);
        setTableIdDelete("");
      }
    } catch {
      toast.error("Đã có lỗi xảy ra!");
    }
  };

  return (
    <>
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
            {roles.map((role) => {
              const Icon = getRoleIcon(role.name);
              const isActive = selectedRole?.id === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                    isActive
                      ? "bg-[#04A7EB] text-white shadow"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{role.name}</span>
                  </div>

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
                      onClick={(e) => {
                        e.stopPropagation();
                        setTableIdDelete(role.id);
                      }}
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

      {/* -------------------- MODAL -------------------- */}
      <FormRole
        id={tableIdEdit}
        setId={setTableIdEdit}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <DialogDelete
        onConfirm={handleDelete}
        tableIdDelete={tableIdDelete}
        setTableIdDelete={setTableIdDelete}
      />
    </>
  );
}
