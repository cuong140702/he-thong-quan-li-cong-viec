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
import { IBodyProject } from "@/utils/interface/project";
import { LoadingData } from "@/components/LoadingData";
import projectApiRequest from "@/apiRequests/project";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableContext } from "./projectTable";
import { IGetUserRes } from "@/utils/interface/user";
import { IQueryBase } from "@/utils/interface/common";
import userApiRequest from "@/apiRequests/user";

type Props = {
  isOpen: boolean;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  onClose: () => void;
};

const schema = z.object({
  name: z.string().trim().min(1, "This field is required"),
  description: z.string().optional(),
  userId: z.string().trim().min(1, "This field is required"),
});

const FormProject = ({ id, setId, isOpen, onClose }: Props) => {
  const form = useForm<IBodyProject>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      userId: "",
    },
  });
  const { setIsRefreshList } = useContext(TableContext);

  const loadingContext = useContext(LoadingData);

  const [dataUsers, setDataUsers] = useState<IGetUserRes[]>([]);

  useEffect(() => {
    if (!id) {
      form.reset({
        userId: "",
        description: "",
        name: "",
      });
      return;
    }

    handleDetailProject(id);
  }, [id]);

  useEffect(() => {
    const paramObject = {
      page: 1,
      limit: 1000,
    };
    handleGetListUser(paramObject);
  }, []);

  const handleGetListUser = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();

      const res = await userApiRequest.list(payload);
      if (!res) return;

      const responseData = res.data;

      setDataUsers(responseData?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleDetailProject = async (id: string) => {
    if (!id) return;

    try {
      loadingContext?.show();

      const res = await projectApiRequest.getProject(id);
      if (!res) return;

      const responseData = res.data;

      form.reset({
        name: responseData?.name || "",
        description: responseData?.description || "",
        userId: responseData?.userId || "",
      });
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

  const onSubmit = (data: IBodyProject) => {
    if (id) {
      return handeleEditProject(data);
    } else {
      return handCreateProject(data);
    }
  };

  const handeleEditProject = async (data: IBodyProject) => {
    if (!id) return;
    try {
      loadingContext?.show();

      const res = await projectApiRequest.updateProject(id, data);
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

  const handCreateProject = async (payload: IBodyProject) => {
    try {
      loadingContext?.show();

      const res = await projectApiRequest.addProject(payload);
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <Label>
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input type="text" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <Label>Description</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Textarea
                          className="w-full break-words break-all resize-none max-h-40 overflow-auto"
                          {...field}
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      User <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataUsers?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default FormProject;
