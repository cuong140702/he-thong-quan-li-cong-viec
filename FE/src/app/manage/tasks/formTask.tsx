import { z } from "zod";
import {
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoadingData } from "@/components/LoadingData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableContext } from "./taskTable";
import { IBodyTask } from "@/utils/interface/task";
import { Textarea } from "@/components/ui/textarea";
import { IGetProjectsResponse } from "@/utils/interface/project";
import { IQueryBase } from "@/utils/interface/common";
import projectApiRequest from "@/apiRequests/project";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import taskApiRequest from "@/apiRequests/task";
import { TaskStatus } from "@/utils/enum/task";
import tagApiRequest from "@/apiRequests/tag";
import { IGetTagsResponse } from "@/utils/interface/tag";
import { BaseSelect } from "@/components/BaseSelect";

type Props = {
  isOpen: boolean;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  onClose: () => void;
};

const schema = z.object({
  title: z.string().trim().min(1, "This field is required"),
  description: z.string().optional().nullable(),
  status: z.enum(TaskStatus),
  deadline: z.date().optional().nullable(),
  projectId: z.string().optional().nullable(),
  tags: z.array(z.string()),
});

const FormTask = ({ id, setId, isOpen, onClose }: Props) => {
  const form = useForm<IBodyTask>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: null,
      status: TaskStatus.in_progress, // giá trị mặc định
      deadline: null,
      projectId: null,
      tags: [],
    },
  });
  const { setIsRefreshList } = useContext(TableContext);

  const loadingContext = useContext(LoadingData);

  const [dataProject, setDataProject] = useState<IGetProjectsResponse[]>([]);
  const [dataTag, setDataTag] = useState<IGetTagsResponse[]>([]);

  useEffect(() => {
    if (!id) {
      form.reset({
        title: "",
        description: null,
        status: TaskStatus.in_progress, // giá trị mặc định
        deadline: null,
        projectId: null,
        tags: [],
      });
      return;
    }

    // handleDetailTag(id);
  }, [id]);

  useEffect(() => {
    getList({ page: 1, limit: 1000 });
    getListTag({ page: 1, limit: 1000 });
  }, []);

  const getList = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await projectApiRequest.list(payload);
      if (!res) return;

      const responseData = res.data;
      setDataProject(responseData?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const getListTag = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await tagApiRequest.list(payload);
      if (!res) return;

      const responseData = res.data;
      setDataTag(responseData?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const reset = () => {
    form.reset();
    setId("");
    onClose();
  };

  const onSubmit = (data: IBodyTask) => {
    if (id) {
      return handeleEditTag(data);
    } else {
      return handCreateTag(data);
    }
  };

  const handeleEditTag = async (data: IBodyTask) => {
    if (!id) return;
    try {
      loadingContext?.show();

      const res = await taskApiRequest.updateTask(id, data);
      if (!res) return;

      const responseData = res.data;
      if (responseData) {
        toast.success("Updated successfully!");
        setIsRefreshList(true);
        reset();
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handCreateTag = async (payload: IBodyTask) => {
    try {
      loadingContext?.show();

      const res = await taskApiRequest.addTask(payload);
      if (!res) return;

      const responseData = res.data;
      if (responseData) {
        toast.success("Created successfully!");
        setIsRefreshList(true);
        reset();
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          form.reset();
          setId("");
        }}
      >
        <DialogHeader>
          <DialogTitle>{id ? "Update" : "Add New"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
            id="table-form"
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input type="text" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label>Description</Label>
                    <Textarea {...field} value={field.value ?? ""} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <Label>Project</Label>
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataProject.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <Label>Tags</Label>
                    <BaseSelect
                      isMulti
                      options={dataTag.map((tag) => ({
                        value: tag.id,
                        label: tag.name,
                      }))}
                      value={dataTag
                        .filter((tag) => field.value?.includes(tag.id))
                        .map((tag) => ({ value: tag.id, label: tag.name }))}
                      onChange={(selected) =>
                        field.onChange(selected.map((item) => item.value))
                      }
                      placeholder=""
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="table-form"
            className="cursor-pointer"
            disabled={id ? !form.formState.isDirty : false}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormTask;
