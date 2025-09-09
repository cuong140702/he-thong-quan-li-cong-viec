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
    <div className="overflow-x-auto">
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
            <tr key={row.id} className="hover:bg-gray-50 transition-all">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-3 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
