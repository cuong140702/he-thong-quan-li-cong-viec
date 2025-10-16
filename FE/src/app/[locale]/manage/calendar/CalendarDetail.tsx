import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { colorMap, formatDate, statusMap } from "@/lib/utils";
import { IGetCalendarDetail } from "@/utils/interface/task";

export type TaskStatus = "break" | "completed" | "in_progress";

export interface IGetCalendarRes {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date | null;
  deadline: Date | null;
  status: TaskStatus;
  projectId?: string | null;
  userId?: string;
  backgroundColor: string;
}

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  dataCalendarDetail: IGetCalendarDetail | null;
};

export default function TaskDetailModal({
  isOpen,
  onClose,
  dataCalendarDetail,
}: Props) {
  const selectedTask: IGetCalendarRes = {
    id: "abc123",
    title: "Họp dự án tuần này",
    description: "Thảo luận tiến độ sprint và phân chia task.",
    startDate: new Date("2025-10-16T09:00:00"),
    deadline: new Date("2025-10-16T10:30:00"),
    status: "in_progress",
    projectId: "Dự án CRM",
    userId: "user123",
    backgroundColor: "#4ade80",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] w-[95%] p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle>{"Thông tin chi tiết"}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {/* Họ tên */}
          <div className="flex items-center gap-5">
            <p className="text-sm font-medium w-[120px]">Họ tên:</p>
            <p className="text-sm break-all flex-1">
              {dataCalendarDetail?.user.fullName ?? "-"}
            </p>
          </div>

          {/* Dự án */}
          <div className="flex items-center gap-5">
            <p className="text-sm font-medium w-[120px]">Dự án:</p>
            <p className="text-sm break-all flex-1">
              {dataCalendarDetail?.title ?? "-"}
            </p>
          </div>

          {/* Mô tả */}
          <div className="flex items-start gap-5">
            <p className="text-sm font-medium w-[120px]">Mô tả:</p>
            <p className="text-sm break-all flex-1">
              {dataCalendarDetail?.description ?? ""}
            </p>
          </div>

          {/* Thời gian */}
          <div className="flex items-center gap-5">
            <p className="text-sm font-medium w-[120px]">Bắt đầu:</p>
            <p className="text-sm">
              {selectedTask.startDate
                ? formatDate(selectedTask.startDate, "dd/MM/yyyy, HH:mm")
                : "-"}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <p className="text-sm font-medium w-[120px]">Kết thúc:</p>
            <p className="text-sm">
              {selectedTask.deadline
                ? formatDate(selectedTask.deadline, "dd/MM/yyyy, HH:mm")
                : "-"}
            </p>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center gap-5">
            <p className="text-sm font-medium w-[120px]">Trạng thái:</p>
            <p
              className="text-sm capitalize"
              style={{
                color: colorMap[dataCalendarDetail?.status as TaskStatus] || "",
              }}
            >
              {statusMap[dataCalendarDetail?.status as TaskStatus] || ""}
            </p>
          </div>

          {/* Màu hiển thị */}
          <div className="flex items-center gap-5">
            <p className="text-sm font-medium w-[120px]">Màu hiển thị:</p>
            <div
              className="w-6 h-6 rounded-full border"
              style={{
                backgroundColor:
                  colorMap[dataCalendarDetail?.status as TaskStatus] || "#ccc",
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
