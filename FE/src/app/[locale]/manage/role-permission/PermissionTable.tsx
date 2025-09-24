"use client";

import { useContext, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { IPermissionsRes } from "@/utils/interface/permission";
import { methodColors } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormPermission from "./formPermission";
import { TableContext } from "./role-permission";
import TableAction from "@/components/TableAction";
import DialogDelete from "@/components/ModalDelete";
import { toast } from "sonner";
import permissionsApiRequest from "@/apiRequests/permission";

interface PermissionTableProps {
  data: IPermissionsRes[];
  search: string;
}

export default function PermissionTable({
  data,
  search,
}: PermissionTableProps) {
  const {
    isOpenPerm,
    setIsOpenPerm,
    tblEditPermId,
    setTblEditPermId,
    tblDeletePermId,
    setTblDeletePermId,
    setIsRefreshListPerm,
  } = useContext(TableContext);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filter theo search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(
      (p) =>
        p.module.toLowerCase().includes(search.toLowerCase()) ||
        p.path.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // Columns definition
  const columns = useMemo<ColumnDef<IPermissionsRes>[]>(
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
        cell: ({ row }) => {
          return (
            <TableAction
              data={row}
              onEdit={() => {
                setIsOpenPerm(true);
                setTblEditPermId(row.original.id);
              }}
              onDelete={() => {
                setTblDeletePermId(row.original.id);
              }}
              module="project"
            />
          );
        },
      },
    ],
    []
  );

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleDelete = async () => {
    if (!tblDeletePermId) return;

    try {
      const res = await permissionsApiRequest.deletePermission(tblDeletePermId);

      if (res.statusCode === 200) {
        toast.success("Deleted successfully!");
        setTblDeletePermId("");
        setIsRefreshListPerm(true);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-gray-500"
              >
                No Results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <FormPermission
        id={tblEditPermId}
        setId={setTblEditPermId}
        isOpen={isOpenPerm}
        onClose={() => setIsOpenPerm(false)}
      />

      <DialogDelete
        onConfirm={handleDelete}
        tableIdDelete={tblDeletePermId}
        setTableIdDelete={setTblDeletePermId}
      />
    </>
  );
}
