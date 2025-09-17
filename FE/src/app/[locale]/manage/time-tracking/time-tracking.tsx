"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Clock, StopCircle, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import taskApiRequest from "@/apiRequests/task";
import { IQueryBase } from "@/utils/interface/common";
import { LoadingData } from "@/components/LoadingData";
import DialogDelete from "@/components/ModalDelete";
import { ITaskRes } from "@/utils/interface/task";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import timeLogApiRequest from "@/apiRequests/timelog";
import { ITimelog } from "@/utils/interface/timelog";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { formatDateTime } from "@/lib/utils";

// Schema form tạo manual log
const manualLogSchema = z.object({
  startTime: z.string().min(1),
  endTime: z.string().optional(),
  note: z.string().optional(),
});

export default function TimeTracking() {
  const loadingContext = useContext(LoadingData);
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = useMemo(() => searchParams.get("taskId"), [searchParams]);
  const [tasks, setTasks] = useState<ITaskRes[]>([]);
  const [logs, setLogs] = useState<ITimelog[]>([]);
  const [timeLogId, setTimeLogId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [taskName, setTaskName] = useState<string>("");
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(manualLogSchema),
  });
  const [tableIdDelete, setTableIdDelete] = useState<string>("");

  // Load danh sách task
  useEffect(() => {
    getList({ page: 1, limit: 1000 });
  }, []);

  // Load logs khi chọn task
  useEffect(() => {
    if (taskId && tasks.length > 0) {
      const name = tasks.find((t) => t.id === taskId)?.title ?? "";
      setTaskName(name);
      fetchLogs();
    }
  }, [taskId, tasks]);

  const getList = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await taskApiRequest.list(payload);
      if (!res) return;

      const responseData = res.data;

      setTasks(responseData?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const fetchLogs = async () => {
    try {
      if (!taskId) return;

      loadingContext?.show();
      const res = await timeLogApiRequest.getLog(taskId);
      if (!res) return;

      const responseData = res.data;

      setLogs(responseData?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleClockIn = async () => {
    if (!taskId) return;
    await timeLogApiRequest.clockIn({ id: taskId });
    fetchLogs();
  };

  const handleClockOut = async () => {
    if (!taskId || !timeLogId) return;

    const log = logs.find((l) => l.id === timeLogId);
    if (!log) return;

    let shouldFetchLogs = false;

    if (!log.endTime) {
      await timeLogApiRequest.clockOut(timeLogId);
      shouldFetchLogs = true;
    }

    const totalRes = await timeLogApiRequest.totalByTask(taskId, {
      startTime: startTime as Date,
    });

    if (totalRes?.data?.totalDurationMinutes != null) {
      setTotal(totalRes.data.totalDurationMinutes);
    }

    if (shouldFetchLogs) {
      fetchLogs();
    }

    setTimeLogId(null);
    setStartTime(null);
  };

  const handleDelete = async () => {
    if (!tableIdDelete) return;

    try {
      await timeLogApiRequest.deleteTimelog(tableIdDelete);

      toast.success("Deleted successfully!");
      setTableIdDelete("");
      fetchLogs();
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!");
    }
  };

  const handleManualLog = async (data: z.infer<typeof manualLogSchema>) => {
    if (!taskId) return alert("Chọn task trước!");
    await axios.post("/api/timelog", { ...data, taskId });
    reset();
    fetchLogs();
  };

  const handleSelectTask = (value: string) => {
    const taskName = tasks.find((t) => t.id === value)?.title ?? "";
    setTaskName(taskName);
    router.push(`?taskId=${value}`);
  };

  const handleRowClick = (log: ITimelog) => {
    setTimeLogId(log.id);
    setStartTime(log?.startTime);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Chọn Task */}
      {!taskId && (
        <Card>
          <CardHeader>
            <CardTitle>Chọn Task</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={taskId ?? undefined}
              onValueChange={handleSelectTask}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="-- Chọn task --" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Clock In / Clock Out / Add Manual Log */}
      {taskId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Task #{taskName} - Timelogs</span>
              <span className="text-sm text-gray-500">
                Total: {total} minutes
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={handleClockIn} className="cursor-pointer">
              <Clock className="mr-2 h-4 w-4" /> Clock In
            </Button>
            <Button
              variant="destructive"
              onClick={handleClockOut}
              disabled={!timeLogId}
              className="cursor-pointer"
            >
              <StopCircle className="mr-2 h-4 w-4" /> Clock Out
            </Button>

            {/* Dialog tạo Manual Log */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Manual Log
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Manual Log</DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-2 mt-2"
                  onSubmit={handleSubmit(handleManualLog)}
                >
                  <div>
                    <label className="block text-sm font-medium">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      {...register("startTime")}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      {...register("endTime")}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Note</label>
                    <input
                      type="text"
                      {...register("note")}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                  <Button type="submit">Create</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Table logs */}
      {taskId && (
        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Duration (min)</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className={log.endTime ? "" : "cursor-pointer"}
                    onClick={() => {
                      if (!log.endTime && !log.durationMinutes) {
                        handleRowClick(log);
                      }
                    }}
                  >
                    <TableCell>{formatDateTime(log.startTime)}</TableCell>
                    <TableCell>{formatDateTime(log.endTime)}</TableCell>
                    <TableCell>{log.durationMinutes}</TableCell>
                    <TableCell>{log.note}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTableIdDelete(log.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <DialogDelete
        onConfirm={handleDelete}
        tableIdDelete={tableIdDelete}
        setTableIdDelete={setTableIdDelete}
      />
    </div>
  );
}
