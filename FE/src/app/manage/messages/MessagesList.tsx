"use client";

import { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  IGetMessageBetweenRes,
  IGetUserMessage,
  IQueryBetween,
} from "@/utils/interface/message";
import { LoadingData } from "@/components/LoadingData";
import messageApiRequest from "@/apiRequests/message";
import { toast } from "sonner";
import {
  decodeToken,
  formatRelativeTime,
  getAccessTokenFromLocalStorage,
} from "@/lib/utils";
import { useAppContext } from "@/components/app-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Sockets } from "@/lib/socket";

export default function MessagesList() {
  const loadingContext = useContext(LoadingData);
  const accessToken = getAccessTokenFromLocalStorage();
  const { sockets } = useAppContext();
  const { messages: message } = (sockets || {}) as Sockets;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<IGetUserMessage>();
  const [messages, setMessages] = useState<IGetMessageBetweenRes[]>([]);
  const [users, setUsers] = useState<IGetUserMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUserId = decodeToken(accessToken as string)?.userId;

  useEffect(() => {
    if (!currentUserId || !selectedUser) return;

    console.log(selectedUser.id);

    const params: IQueryBetween = {
      user1: currentUserId,
      user2: selectedUser?.id,
    };

    console.log(params);

    handleListMessage(params);
  }, [currentUserId, selectedUser]);

  useEffect(() => {
    if (!message) return;

    const handleUserStatusChange = ({
      userId,
      isOnline,
      lastSeen,
    }: {
      userId: string;
      isOnline: boolean;
      lastSeen: Date;
    }) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, isOnline, lastSeen } : u
        )
      );
    };

    message.on("user-status-changed", handleUserStatusChange);

    return () => {
      message.off("user-status-changed", handleUserStatusChange);
    };
  }, [message]);

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId && users.length > 0) {
      const foundUser = users.find((u) => u.id === userId);
      if (foundUser) {
        setSelectedUser(foundUser);
      }
    }
  }, [searchParams, users]);

  useEffect(() => {
    handleFindAllExcluding();
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (message: IGetMessageBetweenRes) => {
      if (
        (message.senderId === selectedUser?.id &&
          message.receiverId === currentUserId) ||
        (message.receiverId === selectedUser?.id &&
          message.senderId === currentUserId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    message?.on("receive-message", handleReceiveMessage);

    return () => {
      message?.off("receive-message", handleReceiveMessage);
    };
  }, [message, selectedUser, currentUserId]);

  const handleSendMessage = () => {
    if (!selectedUser?.id) return;

    const payload = {
      senderId: currentUserId,
      receiverId: selectedUser.id,
      content: newMessage,
      createdAt: new Date(),
    } as IGetMessageBetweenRes;

    message?.emit("send-message", payload);
    setMessages((prev) => [
      ...prev,
      {
        ...payload,
        senderId: payload.senderId,
        receiverId: payload.receiverId,
        content: payload.content,
      },
    ]);

    setNewMessage("");
  };

  const handleListMessage = async (payload: IQueryBetween) => {
    try {
      loadingContext?.show();
      const res = await messageApiRequest.getMessageBetween(payload);
      const responseData = res.data;
      console.log(res);

      if (responseData) setMessages(responseData.data ?? []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleFindAllExcluding = async () => {
    try {
      loadingContext?.show();
      const res = await messageApiRequest.findAllExcluding();
      const responseData = res?.data;

      if (responseData && responseData.data) {
        setUsers(responseData.data);
      }
    } catch {
      toast.error("Lỗi khi gọi API!");
    } finally {
      loadingContext?.hide();
    }
  };

  const handleSelectUser = (user: IGetUserMessage) => {
    setSelectedUser(user);
    router.push(`?userId=${user.id}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[90vh] p-4">
      {/* Sidebar */}
      <div className="col-span-3 border-r dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-700 placeholder:text-slate-400 transition"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-sm">
              🔍
            </span>
          </div>
        </div>

        <ul className="overflow-y-auto space-y-2 px-3 py-4 flex-1 custom-scrollbar">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 
                ${
                  selectedUser?.id === user.id
                    ? "bg-muted shadow-md dark:bg-slate-800"
                    : "bg-muted/60 hover:bg-muted dark:hover:bg-slate-800"
                }`}
            >
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatarUrl || ""} />
                  <AvatarFallback>
                    {user.fullName?.slice(0, 1) || "U"}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-sm truncate">
                  {user.fullName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat box */}
      <div className="col-span-9">
        <Card className="h-full max-h-[90vh] flex flex-col">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-base">
              {selectedUser
                ? `Chat with ${selectedUser.fullName}`
                : "Chọn người để bắt đầu"}
            </CardTitle>
            <span className="text-xs text-white/70">
              {selectedUser?.isOnline
                ? "Online"
                : selectedUser?.lastSeen
                ? `Last seen ${formatRelativeTime(selectedUser.lastSeen)}`
                : ""}
            </span>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-4 overflow-y-auto">
              <div className="space-y-3 py-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.senderId === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] w-fit rounded-2xl shadow-md text-sm break-words whitespace-pre-wrap ${
                        msg.senderId === currentUserId
                          ? "bg-[#04A7EB] text-white rounded-br-none"
                          : "bg-[#133644] text-white rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                      <div className="text-[10px] text-white/70 mt-1 text-right"></div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {selectedUser && (
              <div className="mt-2 flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[40px] max-h-40 resize-none flex-1"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
