import { http } from "@/utils/api";
import {
  IBodyMessage,
  IGetMessageBetweenRes,
  IGetUserMessage,
  IQueryBetween,
} from "@/utils/interface/message";

const messageApiRequest = {
  createMessage: (body: IBodyMessage) => http.post("messages", body),
  getMessageBetween: (data: IQueryBetween) =>
    http.get<IBackendRes<IGetMessageBetweenRes[]>>(`messages/between`, {
      queryParams: data,
    }),
  findAllExcluding: () =>
    http.get<IBackendRes<IGetUserMessage[]>>(`messages/exclude-self`),
};

export default messageApiRequest;
