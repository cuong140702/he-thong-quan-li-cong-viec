import { z } from "zod";
import { useContext, useEffect, Dispatch, SetStateAction } from "react";

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
import { TableContext } from "./tagTable";
import { IBodyTag } from "@/utils/interface/tag";
import tagApiRequest from "@/apiRequests/tag";

type Props = {
  isOpen: boolean;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  onClose: () => void;
};

const schema = z.object({
  name: z.string().trim().min(1, "This field is required"),
});

const FormTag = ({ id, setId, isOpen, onClose }: Props) => {
  const form = useForm<IBodyTag>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });
  const { setIsRefreshList } = useContext(TableContext);

  const loadingContext = useContext(LoadingData);

  useEffect(() => {
    if (!id) {
      form.reset({
        name: "",
      });
      return;
    }

    handleDetailTag(id);
  }, [id]);

  const handleDetailTag = async (id: string) => {
    if (!id) return;

    try {
      loadingContext?.show();

      const res = await tagApiRequest.getTag(id);
      if (!res) return;

      const responseData = res.data;

      form.reset({
        name: responseData?.name || "",
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

  const onSubmit = (data: IBodyTag) => {
    if (id) {
      return handeleEditTag(data);
    } else {
      return handCreateTag(data);
    }
  };

  const handeleEditTag = async (data: IBodyTag) => {
    if (!id) return;
    try {
      loadingContext?.show();

      const res = await tagApiRequest.updateTag(id, data);
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

  const handCreateTag = async (payload: IBodyTag) => {
    try {
      loadingContext?.show();

      const res = await tagApiRequest.addTag(payload);
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

export default FormTag;
