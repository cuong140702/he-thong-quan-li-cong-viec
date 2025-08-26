"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
import { Permission } from "@/utils/interface/permission";
import { useAppContext } from "./app-context";

type Props<T> = {
  data?: T;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  module: Permission["module"];
};

const TableAction = <T extends { id: string }>({
  data,
  onView,
  onEdit,
  onDelete,
  module,
}: Props<T>) => {
  const { can } = useAppContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {onView && data && can(module, "GET", `/${module}/${data.id}`) && (
          <DropdownMenuItem
            onClick={() => setTimeout(() => onView(data.id), 0)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> View
          </DropdownMenuItem>
        )}

        {onEdit && data && can(module, "PUT", `/${module}/${data.id}`) && (
          <DropdownMenuItem
            onClick={() => setTimeout(() => onEdit(data.id), 0)}
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" /> Edit
          </DropdownMenuItem>
        )}

        {onDelete && data && can(module, "DELETE", `/${module}/${data.id}`) && (
          <DropdownMenuItem
            onClick={() => setTimeout(() => onDelete(data.id), 0)}
            className="flex items-center gap-2 text-destructive"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default TableAction;
