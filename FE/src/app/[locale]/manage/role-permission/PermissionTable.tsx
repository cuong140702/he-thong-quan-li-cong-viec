"use client";

import { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PermissionTableProps {
  data: IPermissionsRes[];
  search: string;
}

export default function PermissionTable({
  data,
  search,
}: PermissionTableProps) {
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

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
    </>
  );
}
