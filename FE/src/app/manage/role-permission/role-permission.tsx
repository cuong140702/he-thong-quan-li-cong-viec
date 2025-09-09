"use client";

import {
  useState,
  useMemo,
  useContext,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingData } from "@/components/LoadingData";
import { IQueryBase } from "@/utils/interface/common";
import { IRolesRes } from "@/utils/interface/role";
import { IPermissionsRes } from "@/utils/interface/permission";
import roleApiRequest from "@/apiRequests/role";
import permissionsApiRequest from "@/apiRequests/permission";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/components/app-context";

import RolesSidebar from "./RolesSidebar";
import RolePermissions from "./RolePermissions";
import PermissionTable from "./PermissionTable";

type TableContextType = {
  tableIdEdit: string;
  setTableIdEdit: Dispatch<SetStateAction<string>>;
  tableIdDelete: string;
  setTableIdDelete: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isRefreshList: boolean;
  setIsRefreshList: Dispatch<SetStateAction<boolean>>;
};

export const TableContext = createContext<TableContextType>({
  tableIdEdit: "",
  setTableIdEdit: () => {},
  tableIdDelete: "",
  setTableIdDelete: () => {},
  isOpen: false,
  setIsOpen: () => {},
  isRefreshList: false,
  setIsRefreshList: () => {},
});

export default function RolePermissionPage() {
  const { setPermissions } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleId = useMemo(() => searchParams.get("roleId"), [searchParams]);
  const loadingContext = useContext(LoadingData);

  const [tableIdEdit, setTableIdEdit] = useState<string>("");
  const [tableIdDelete, setTableIdDelete] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRefreshList, setIsRefreshList] = useState<boolean>(false);

  const [dataRole, setDataRole] = useState<IRolesRes[]>([]);
  const [dataPermission, setDataPermission] = useState<IPermissionsRes[]>([]);
  const [selectedRole, setSelectedRole] = useState<IRolesRes | null>(null);
  const [search, setSearch] = useState("");

  // Fetch roles + permissions
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
      if (role) handleSelectRole(role);
    }
  }, [dataRole, roleId]);

  const handleSelectRole = (role: IRolesRes) => {
    setSelectedRole(role);
    router.push(`?roleId=${role.id}`);
  };

  const getListRole = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await roleApiRequest.list(payload);
      setDataRole(res?.data?.data ?? []);
    } catch {
      toast.error("Lỗi khi tải danh sách roles!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleGetAllPermissions = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await permissionsApiRequest.list(payload);
      setDataPermission(res?.data?.data ?? []);
    } catch {
      toast.error("Lỗi khi tải danh sách permissions!");
    } finally {
      loadingContext?.hide();
    }
  };

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

          {/* Tab Roles */}
          <TabsContent value="roles" className="mt-4">
            <div className="grid grid-cols-12 gap-6">
              <RolesSidebar
                roles={dataRole}
                selectedRole={selectedRole}
                setSelectedRole={handleSelectRole}
              />
              <RolePermissions
                role={selectedRole}
                dataPermission={dataPermission}
                setPermissions={setPermissions}
              />
            </div>
          </TabsContent>

          {/* Tab Permissions */}
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
              <PermissionTable data={dataPermission} search={search} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TableContext.Provider>
  );
}
