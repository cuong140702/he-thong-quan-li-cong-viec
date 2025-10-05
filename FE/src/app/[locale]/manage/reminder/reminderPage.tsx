"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LoadingData } from "@/components/LoadingData";
import { IQueryBase } from "@/utils/interface/common";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import reminderApiRequest from "@/apiRequests/reminder";
import taskApiRequest from "@/apiRequests/task";
import {
  IBodyReminder,
  IGetRemindersResponse,
} from "@/utils/interface/reminder";
import { useRouter } from "@/i18n/navigation";
import AutoPagination from "@/components/auto-pagination";
import { Trash2 } from "lucide-react";
import { ITaskRes } from "@/utils/interface/task";

// ===================== SCHEMA VALIDATE =====================
const reminderSchema = z.object({
  taskId: z.string().min(1, "Vui lòng chọn task!"),
  remindAt: z.string().min(1, "Vui lòng chọn thời gian!"),
});

// ==========================================================

export default function ReminderPage() {
  const loadingContext = useContext(LoadingData);
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IBodyReminder>({
    resolver: zodResolver(reminderSchema) as Resolver<IBodyReminder>,
    defaultValues: {
      taskId: "",
      remindAt: "",
    },
  });

  const searchParams = useSearchParams();
  const pageFromParams = useMemo(
    () => Number(searchParams.get("page")) || 1,
    [searchParams]
  );
  const router = useRouter();

  const [reminders, setReminders] = useState<IGetRemindersResponse[]>([]);
  const [tasks, setTasks] = useState<ITaskRes[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [paramObject, setParamObject] = useState<IQueryBase>({
    page: pageFromParams,
    limit: 9,
  });
  const [pagination, setPagination] = useState({
    pageIndex: pageFromParams,
    pageSize: 10,
  });

  useEffect(() => {
    getList(paramObject);
  }, [paramObject]);

  useEffect(() => {
    getListTasks({ page: 1, limit: 100 });
  }, []);

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

  const onSubmit = async (body: IBodyReminder) => {
    try {
      loadingContext?.show();
      const res = await reminderApiRequest.createReminder(body);
      if (!res) return;
      toast.success("Created successfully!");
      reset();
      getList(paramObject);
    } catch (error) {
      toast.error("Lỗi khi tạo reminder!");
    } finally {
      loadingContext?.hide();
    }
  };

  const getList = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await reminderApiRequest.getReminders(payload);
      if (!res) return;
      setReminders(res.data?.data ?? []);
      setTotal(res.data?.totalItems || 0);
      setPagination({
        pageIndex: res.data?.page ?? 1,
        pageSize: res.data?.limit ?? 10,
      });
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const getListTasks = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await taskApiRequest.list(payload);
      if (!res) return;
      setTasks(res.data?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;

    try {
      const res = await reminderApiRequest.deleteReminder(id);

      if (res.statusCode === 200) {
        let newPageIndex = pagination.pageIndex;

        if (reminders.length === 1 && pagination.pageIndex > 1) {
          newPageIndex = pagination.pageIndex - 1;
          setPagination((prev) => ({
            ...prev,
            pageIndex: newPageIndex,
          }));

          setParamObject((prev) => ({
            ...prev,
            page: newPageIndex,
          }));
        }
        toast.success("Deleted successfully!");
        getList(paramObject);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!");
    }
  };

  return (
    <div className="w-full h-full mx-auto flex flex-col p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">📅 Reminders</h1>
      {/* Form tạo reminder */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Tạo Reminder mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            {/* Task Select */}
            <div className="flex flex-col space-y-2">
              <Label>Chọn Task</Label>
              <div>
                <Select
                  onValueChange={(val) =>
                    setValue("taskId", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="h-10 w-full p-5">
                    <SelectValue placeholder="Chọn task cần nhắc" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.taskId && (
                <p className="text-sm text-red-500">{errors.taskId.message}</p>
              )}
            </div>

            {/* DateTime input */}
            <div className="flex flex-col space-y-2">
              <Label>Thời gian nhắc</Label>
              <Input
                type="datetime-local"
                className="h-10"
                value={watch("remindAt") || ""}
                onChange={(e) =>
                  setValue("remindAt", e.target.value, { shouldValidate: true })
                }
              />
              {errors.remindAt && (
                <p className="text-sm text-red-500">
                  {errors.remindAt.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex flex-col space-y-2">
              <Label className="invisible">Tạo</Label>
              <Button type="submit" className="w-full h-10">
                ➕ Tạo Reminder
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Danh sách reminders */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map((r) => (
          <Card
            key={r.id}
            className="shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-base font-semibold">
                  {r?.task?.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Nhắc lúc:{" "}
                  {new Date(r.remindAt).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Badge
                  className={`${
                    r.isSent
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  } text-white`}
                >
                  {r.isSent ? "✅ Đã gửi" : "⏳ Chưa gửi"}
                </Badge>

                {/* Nút xóa */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                  onClick={() => handleDelete(r?.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="py-4">
        <AutoPagination
          pageSize={Math.ceil(total / pagination.pageSize)}
          pathname="/manage/reminder"
        />
      </div>
    </div>
  );
}
