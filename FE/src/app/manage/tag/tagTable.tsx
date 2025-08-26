"use client";

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { useState, createContext, useContext, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { LoadingData } from "@/components/LoadingData";
import AutoPagination from "@/components/auto-pagination";
import DialogDelete from "@/components/ModalDelete";
import { Button } from "@/components/ui/button";
import { IQueryBase } from "@/utils/interface/common";
import tagApiRequest from "@/apiRequests/tag";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IGetTagsResponse } from "@/utils/interface/tag";
import FormTag from "./formTag";
import TableAction from "@/components/TableAction";
import { ShowIfCan } from "@/lib/utils";

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

export const columns: ColumnDef<IGetTagsResponse>[] = [
  {
    id: "stt",
    header: "STT",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { setTableIdEdit, setTableIdDelete, setIsOpen } =
        useContext(TableContext);

      return (
        <TableAction
          data={row}
          onEdit={() => {
            setIsOpen(true);
            setTableIdEdit(row.original.id);
          }}
          onDelete={() => {
            setIsOpen(true);
            setTableIdDelete(row.original.id);
          }}
          module="tag"
        />
      );
    },
  },
];

export default function TagTable() {
  const loadingContext = useContext(LoadingData);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageFromParams = useMemo(
    () => Number(searchParams.get("page")) || 1,
    [searchParams]
  );

  const [tableIdEdit, setTableIdEdit] = useState<string>("");
  const [tableIdDelete, setTableIdDelete] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageIndex: pageFromParams,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [data, setData] = useState<IGetTagsResponse[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [paramObject, setParamObject] = useState<IQueryBase>({
    page: pageFromParams,
    limit: 10,
  });
  const [isRefreshList, setIsRefreshList] = useState<boolean>(false);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pagination.pageSize),
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex - 1,
        pageSize: pagination.pageSize,
      },
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const newPagination =
          typeof updater === "function" ? updater(old) : updater;
        return {
          ...old,
          pageIndex: newPagination.pageIndex + 1,
        };
      });
    },
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: pageFromParams,
    }));
  }, [pageFromParams]);

  useEffect(() => {
    setParamObject((prev) => ({
      ...prev,
      page: pagination.pageIndex,
    }));

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pagination.pageIndex));
    router.push(`?${params.toString()}`);
  }, [pagination.pageIndex]);

  useEffect(() => {
    getList(paramObject);
  }, [paramObject]);

  useEffect(() => {
    if (isRefreshList) {
      getList(paramObject);
      setIsRefreshList(false);
    }
  }, [isRefreshList]);

  const getList = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await tagApiRequest.list(payload);
      if (!res) return;

      const responseData = res.data;
      setData(responseData?.data ?? []);
      setTotal(responseData?.totalItems || 0);
      setPagination({
        pageIndex: responseData?.page ?? 1,
        pageSize: responseData?.limit ?? 10,
      });
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleAddNew = () => {
    setIsOpen(true);
    setTableIdEdit("");
    setTableIdDelete("");
  };

  const handleDelete = async () => {
    if (!tableIdDelete) return;

    try {
      const res = await tagApiRequest.deleteTag(tableIdDelete);

      if (res.statusCode === 200) {
        let newPageIndex = pagination.pageIndex;

        if (data.length === 1 && pagination.pageIndex > 1) {
          newPageIndex = pagination.pageIndex - 1;
          setPagination((prev) => ({
            ...prev,
            pageIndex: newPageIndex,
          }));
        }

        setParamObject((prev) => ({
          ...prev,
          page: newPageIndex,
        }));

        toast.success("Deleted successfully!");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!");
    } finally {
      setTableIdDelete("");
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
      <div className="w-full">
        <div className="flex justify-end py-4">
          <ShowIfCan module="tag" method="POST" path="/tag">
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          </ShowIfCan>
        </div>

        <div className="rounded-md border">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1">
            Hiển thị{" "}
            <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
            <strong>{data.length}</strong> kết quả
          </div>
          <div>
            {table.getRowModel().rows.length > 0 && (
              <AutoPagination
                pageSize={table.getPageCount()}
                pathname="/manage/tag"
              />
            )}
          </div>
        </div>
      </div>

      <FormTag
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
    </TableContext.Provider>
  );
}
