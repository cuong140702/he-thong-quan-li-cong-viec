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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IQueryBase } from "@/utils/interface/common";
import { IBodyRole } from "@/utils/interface/role";
import roleApiRequest from "@/apiRequests/role";
import { BaseSelect } from "@/components/BaseSelect";
import { IPermissionsRes } from "@/utils/interface/permission";
import permissionsApiRequest from "@/apiRequests/permission";
import { TableContext } from "./role-permission";
import { useTranslations } from "next-intl";

type Props = {
  isOpen: boolean;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  onClose: () => void;
};

const schema = z.object({
  name: z.string().min(1, { message: "required" }),
  description: z.string().nullable(),
  permissions: z.array(z.string()),
});

const FormRole = ({ id, setId, isOpen, onClose }: Props) => {
  const form = useForm<IBodyRole>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const loadingContext = useContext(LoadingData);
  const { setIsRefreshList } = useContext(TableContext);
  const errorMessageT = useTranslations("ErrorMessage");
  const tCommon = useTranslations("Common");

  const [dataPermission, setDataPermission] = useState<IPermissionsRes[]>([]);

  useEffect(() => {
    if (!id) {
      form.reset({
        permissions: [],
        description: "",
        name: "",
      });
      return;
    }

    handleDetailRole(id);
  }, [id]);

  useEffect(() => {
    const paramObject = {
      page: 1,
      limit: 1000,
    };
    handleGetListPermission(paramObject);
  }, []);

  const handleGetListPermission = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();

      const res = await permissionsApiRequest.list(payload);
      if (!res) return;

      const responseData = res.data;

      setDataPermission(responseData?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleDetailRole = async (id: string) => {
    if (!id) return;

    try {
      loadingContext?.show();

      const res = await roleApiRequest.getRoleById(id);
      if (!res) return;

      const responseData = res.data;

      form.reset({
        name: responseData?.name || "",
        description: responseData?.description || "",
        permissions:
          responseData?.permissions?.map((p: IPermissionsRes) => p.id) ?? [],
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

  const onSubmit = (data: IBodyRole) => {
    if (id) {
      return handleEditRole(data);
    } else {
      return handleCreateRole(data);
    }
  };

  const handleEditRole = async (data: IBodyRole) => {
    if (!id) return;
    try {
      loadingContext?.show();

      const res = await roleApiRequest.updateRole(id, data);
      if (!res) return;

      const responseData = res.data;
      if (responseData) {
        toast.success("Updated successfully!");
        reset();
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleCreateRole = async (payload: IBodyRole) => {
    try {
      loadingContext?.show();

      const res = await roleApiRequest.addRole(payload);
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
                name="name"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <Label>
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input type="text" className="w-full" {...field} />
                        <FormMessage>
                          {Boolean(errors.name?.message) &&
                            errorMessageT(errors.name?.message as any)}
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
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <Label>Permissions</Label>
                    <BaseSelect
                      isMulti
                      options={dataPermission.map((data) => ({
                        value: data.id,
                        label: `${data.path} - ${data.method.toUpperCase()}`,
                      }))}
                      value={dataPermission
                        .filter((data) => field.value?.includes(data.id))
                        .map((data) => ({
                          value: data.id,
                          label: `${data.path} - ${data.method.toUpperCase()}`,
                        }))}
                      onChange={(selected) =>
                        field.onChange(selected.map((item) => item.value))
                      }
                      placeholder=""
                      menuPlacement="bottom"
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
            {tCommon("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormRole;
