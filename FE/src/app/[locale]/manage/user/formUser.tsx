import { ICreateUser, IUpdateUser } from "@/utils/interface/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { TableContext } from "./userTable";
import { LoadingData } from "@/components/LoadingData";
import { IRolesRes } from "@/utils/interface/role";
import { IQueryBase } from "@/utils/interface/common";
import roleApiRequest from "@/apiRequests/role";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import userApiRequest from "@/apiRequests/user";

type Props = {
  isOpen: boolean;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  onClose: () => void;
};

const schema = z.object({
  email: z.string().min(1, { message: "required" }).email({
    message: "invalidEmail",
  }),
  password: z.string().min(6, { message: "minmaxPassword" }),
  roleId: z.string().min(1, { message: "required" }),
  fullName: z.string().min(1, { message: "required" }),
});

const FormUser = ({ id, setId, isOpen, onClose }: Props) => {
  const form = useForm<ICreateUser>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      roleId: "",
    },
  });

  const { setIsRefreshList } = useContext(TableContext);

  const loadingContext = useContext(LoadingData);

  const errorMessageT = useTranslations("ErrorMessage");
  const tCommon = useTranslations("Common");

  const [dataRoles, setDataRoles] = useState<IRolesRes[]>([]);

  useEffect(() => {
    getListRoles({ page: 1, limit: 1000 });
  }, []);

  useEffect(() => {
    if (!id) {
      form.reset({
        email: "",
        fullName: "",
        password: "",
        roleId: "",
      });
      return;
    }

    handleDetailUser(id);
  }, [id]);

  const handleDetailUser = async (id: string) => {
    if (!id) return;

    try {
      loadingContext?.show();

      const res = await userApiRequest.detailUser(id);
      if (!res) return;

      const responseData = res.data;

      form.reset({
        email: responseData?.email || "",
        fullName: responseData?.fullName || "",
        password: responseData?.password || "",
        roleId: responseData?.roleId || "",
      });
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const getListRoles = async (payload: IQueryBase) => {
    try {
      loadingContext?.show();
      const res = await roleApiRequest.list(payload);
      if (!res) return;

      const responseData = res.data;
      setDataRoles(responseData?.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const onSubmit = (data: ICreateUser) => {
    if (id) {
      const { password, ...rest } = data;
      handeleEditUser(rest);
    } else {
      return handCreateUser(data);
    }
  };

  const handCreateUser = async (payload: ICreateUser) => {
    try {
      loadingContext?.show();

      const res = await userApiRequest.createUser(payload);
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

  const handeleEditUser = async (data: IUpdateUser) => {
    if (!id) return;
    try {
      loadingContext?.show();

      const res = await userApiRequest.updateUser(id, data);
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
                name="email"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <Label>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input type="text" {...field} disabled={Boolean(id)} />
                    <FormMessage>
                      {Boolean(errors.email?.message) &&
                        errorMessageT(errors.email?.message as any)}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <Label>
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input type="text" {...field} />
                    <FormMessage>
                      {Boolean(errors.fullName?.message) &&
                        errorMessageT(errors.fullName?.message as any)}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <Label>
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input type="text" {...field} disabled={Boolean(id)} />
                    <FormMessage>
                      {Boolean(errors.password?.message) &&
                        errorMessageT(errors.password?.message as any)}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <Label>
                      Role Name <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataRoles?.map((data) => (
                          <SelectItem key={data.id} value={data.id}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {Boolean(errors.roleId?.message) &&
                        errorMessageT(errors.roleId?.message as any)}
                    </FormMessage>
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

export default FormUser;
