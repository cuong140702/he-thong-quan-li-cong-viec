"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
  formatMessageTime,
  getAccessTokenFromLocalStorage,
} from "@/lib/utils";
import { useAppContext } from "@/components/app-context";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Sockets } from "@/lib/socket";
import mediaApiRequest from "@/apiRequests/media";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";

export default function MessagesList() {
  const loadingContext = useContext(LoadingData);
  const accessToken = getAccessTokenFromLocalStorage();
  const { sockets } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages: message } = (sockets || {}) as Sockets;
  const currentUserId = decodeToken(accessToken as string)?.userId;
  const userId = useMemo(() => searchParams.get("userId"), [searchParams]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [selectedUser, setSelectedUser] = useState<IGetUserMessage>();
  const [messages, setMessages] = useState<IGetMessageBetweenRes[]>([]);
  const [users, setUsers] = useState<IGetUserMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!currentUserId || !selectedUser) return;

    const params: IQueryBetween = {
      user1: currentUserId,
      user2: selectedUser?.id,
    };

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (msg: IGetMessageBetweenRes) => {
      if (
        (msg.senderId === selectedUser?.id &&
          msg.receiverId === currentUserId) ||
        (msg.receiverId === selectedUser?.id && msg.senderId === currentUserId)
      ) {
        console.log(msg);

        setMessages((prev) => [...prev, msg]);
      }
    };

    message?.on("receive-message", handleReceiveMessage);
    message?.on("message-sent", handleReceiveMessage);

    return () => {
      message?.off("receive-message", handleReceiveMessage);
      message?.off("message-sent", handleReceiveMessage);
    };
  }, [message, selectedUser, currentUserId]);

  const handleSendMessage = async () => {
    if (!selectedUser?.id) return;

    // 1. Gửi text nếu có
    if (newMessage.trim()) {
      const textPayload: IGetMessageBetweenRes = {
        senderId: currentUserId,
        receiverId: selectedUser.id,
        content: newMessage.trim(),
        type: "text",
        createdAt: new Date(),
      };
      message?.emit("send-message", textPayload);
      setNewMessage("");
    }

    // 2. Gửi ảnh nếu có
    if (imageFiles.length > 0) {
      try {
        loadingContext?.show();

        const res = await mediaApiRequest.uploadFiles(imageFiles);
        const uploadedFiles = res.data;

        uploadedFiles?.forEach((file) => {
          const imagePayload: IGetMessageBetweenRes = {
            senderId: currentUserId,
            receiverId: selectedUser.id,
            content: file.url,
            type: "image",
            createdAt: new Date(),
          };
          message?.emit("send-message", imagePayload);
        });

        setImageFiles([]);
      } catch {
        toast.error("Lỗi khi gửi ảnh!");
      } finally {
        loadingContext?.hide();
      }
    }
  };

  const handleListMessage = async (payload: IQueryBetween) => {
    try {
      loadingContext?.show();
      const res = await messageApiRequest.getMessageBetween(payload);
      const responseData = res.data;

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
    <div className="grid grid-cols-12 gap-4 h-[85vh] mt-2">
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
        <Card className="h-full max-h-[85vh] flex flex-col">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-base">
              {selectedUser
                ? `Chat with ${selectedUser.fullName}`
                : "Chọn người để bắt đầu"}
            </CardTitle>
            <span className="text-xs text-gray-600 dark:text-white/70">
              {selectedUser?.isOnline
                ? "Online"
                : selectedUser?.lastSeen
                ? `Last seen ${formatMessageTime(selectedUser.lastSeen)}`
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
                      {msg.type === "image" ? (
                        <>
                          <img
                            src={msg.content}
                            alt="message image"
                            className="max-w-full max-h-60 rounded-lg"
                          />
                        </>
                      ) : (
                        msg.content
                      )}
                      <div className="text-[10px] text-white/70 mt-1 text-right"></div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {selectedUser && (
              <div className="mt-2 w-full">
                {/* Thanh nhập */}
                <div className="flex flex-col bg-white dark:bg-slate-900 border dark:border-gray-700 rounded-2xl shadow-sm p-2">
                  {/* Preview ảnh (nếu có) */}
                  {imageFiles.length > 0 && (
                    <div className="flex gap-2 mb-2 overflow-x-auto">
                      {imageFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            onClick={() =>
                              setImageFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    {/* Textarea */}
                    <Textarea
                      placeholder="Aa..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 border-none focus:ring-0 bg-transparent resize-none min-h-[36px] max-h-32"
                    />

                    {/* Upload ảnh */}
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files) return;
                        setImageFiles((prev) => [
                          ...prev,
                          ...Array.from(files),
                        ]);
                      }}
                    />

                    {/* Label đóng vai trò button */}
                    <div className="flex justify-center items-center mb-1">
                      <Label
                        htmlFor="imageUpload"
                        className="cursor-pointer flex  text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg px-2"
                      >
                        <ImageIcon className="w-7 h-7" />
                      </Label>

                      {/* Nút gửi */}
                      <Button
                        className="rounded-full w-7 h-7 flex  bg-blue-500 hover:bg-blue-600 transition shadow-md px-2"
                        type="submit"
                        onClick={handleSendMessage}
                      >
                        ➤
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
