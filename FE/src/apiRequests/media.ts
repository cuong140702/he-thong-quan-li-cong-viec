import { http } from "@/utils/api";
import { IUploadFileRes } from "@/utils/interface/common";

const mediaApiRequest = {
  uploadFiles: (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    return http.post<IUploadFileRes[]>("media/images/upload", formData);
  },
};

export default mediaApiRequest;
