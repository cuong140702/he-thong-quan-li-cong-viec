import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, Dispatch, SetStateAction, useEffect } from "react";

import { LoadingData } from "@/components/LoadingData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { IBodyPermission } from "@/utils/interface/permission";
import { HTTPMethod } from "@/utils/enum/permission";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import permissionsApiRequest from "@/apiRequests/permission";
import { toast } from "sonner";
import { TableContext } from "./role-permission";
import { useTranslations } from "next-intl";

type Props = {
  isOpen: boolean;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  onClose: () => void;
};

const schema = z.object({
  module: z.string().min(1, { message: "required" }),
  description: z.string().nullable().optional(),
  path: z.string().min(1, { message: "required" }),
  method: z.enum(HTTPMethod),
});

const FormPermission = ({ id, setId, isOpen, onClose }: Props) => {
  const { setIsRefreshListPerm } = useContext(TableContext);
  const loadingContext = useContext(LoadingData);
  const errorMessageT = useTranslations("ErrorMessage");
  const tCommon = useTranslations("Common");

  const form = useForm<IBodyPermission>({
    resolver: zodResolver(schema),
    defaultValues: {
      module: "",
      description: "",
      path: "",
      method: HTTPMethod.GET,
    },
  });

  useEffect(() => {
    if (!id) {
      form.reset({
        module: "",
        description: "",
        path: "",
        method: HTTPMethod.GET,
      });
      return;
    }

    handleDetailPermission(id);
  }, [id]);

  const onSubmit = (data: IBodyPermission) => {
    if (id) {
      return handeleEditPermission(data);
    } else {
      return handCreatePermission(data);
    }
  };

  const handeleEditPermission = async (data: IBodyPermission) => {
    if (!id) return;
    try {
      loadingContext?.show();

      const res = await permissionsApiRequest.updatePermission(id, data);
      if (!res) return;

      const responseData = res.data;
      if (responseData) {
        toast.success("Updated successfully!");
        setIsRefreshListPerm(true);
        reset();
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleDetailPermission = async (id: string) => {
    if (!id) return;

    try {
      loadingContext?.show();

      const res = await permissionsApiRequest.getPermissionById(id);
      if (!res) return;

      const responseData = res.data;

      form.reset({
        path: responseData?.path || "",
        description: responseData?.description || "",
        method: (responseData?.method as HTTPMethod) || "",
        module: responseData?.module || "",
      });
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handCreatePermission = async (payload: IBodyPermission) => {
    try {
      loadingContext?.show();

      const res = await permissionsApiRequest.createPermission(payload);
      if (!res) return;

      const responseData = res.data;
      if (responseData) {
        toast.success("Created successfully!");
        setIsRefreshListPerm(true);
        reset();
      }
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
          <DialogDescription />
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
                name="module"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <Label>
                        Module <span className="text-red-500">*</span>
                      </Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input type="text" className="w-full" {...field} />
                        <FormMessage>
                          {Boolean(errors.module?.message) &&
                            errorMessageT(errors.module?.message as any)}
                        </FormMessage>
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
                          value={field.value ?? ""}
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="path"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <Label>
                        Path <span className="text-red-500">*</span>
                      </Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input type="text" className="w-full" {...field} />
                        <FormMessage>
                          {Boolean(errors.path?.message) &&
                            errorMessageT(errors.path?.message as any)}
                        </FormMessage>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <Label>
                        Method <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(HTTPMethod).map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {Boolean(errors.method?.message) &&
                          errorMessageT(errors.method?.message as any)}
                      </FormMessage>
                    </div>
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
            {tCommon("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormPermission;
