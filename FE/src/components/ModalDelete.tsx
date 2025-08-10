"use client";
import { Trash2 } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

type Props = {
  tableIdDelete: string;
  setTableIdDelete: (value: string) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

const DialogDelete = ({
  tableIdDelete,
  setTableIdDelete,
  onConfirm,
  title,
  description,
}: Props) => {
  return (
    <Dialog
      open={Boolean(tableIdDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableIdDelete("");
        }
      }}
    >
      <DialogContent className="sm:max-w-md flex flex-col items-center gap-4">
        <div className="bg-red-800/20 p-4 rounded-full">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>

        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-xl font-semibold text-gray-400">
            {title || "Delete item"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            {description || "Are you sure you want to delete this item?"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex w-full  lg:justify-center gap-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => {
              onConfirm?.();
              setTableIdDelete("");
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DialogDelete);
