"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// Dummy users
const dummyUsers = [
  { id: 1, name: "John Smith", avatar: "", online: true },
  { id: 2, name: "Emily Davis", avatar: "", online: false },
  { id: 3, name: "Michael Brown", avatar: "", online: true },
];

// Dummy messages by user
const dummyMessages = [
  {
    id: 1,
    senderId: 1,
    receiverId: 0,
    content: "Hey there!",
    time: "10:00 AM",
  },
  {
    id: 2,
    senderId: 0,
    receiverId: 1,
    content: "Hi! How are you?",
    time: "10:01 AM",
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 0,
    content: "Just sent the file.",
    time: "10:02 AM",
  },
  {
    id: 4,
    senderId: 2,
    receiverId: 0,
    content: "Are you available?",
    time: "11:00 AM",
  },
  {
    id: 5,
    senderId: 0,
    receiverId: 2,
    content: "Yes, I am.",
    time: "11:01 AM",
  },
  {
    id: 6,
    senderId: 3,
    receiverId: 0,
    content: "Meeting at 2 PM",
    time: "09:30 AM",
  },
];

export default function MessagesList() {
  const [selectedUser, setSelectedUser] = useState(dummyUsers[0]);

  const filteredMessages = dummyMessages.filter(
    (msg) =>
      (msg.senderId === selectedUser.id && msg.receiverId === 0) ||
      (msg.receiverId === selectedUser.id && msg.senderId === 0)
  );

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
          {dummyUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 
                ${
                  selectedUser.id === user.id
                    ? "bg-muted shadow-md dark:bg-slate-800"
                    : "bg-muted/60 hover:bg-muted dark:hover:bg-slate-800"
                }`}
            >
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-sm truncate">
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.online ? "Online" : "Offline"}
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
              Chat with {selectedUser.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-4 overflow-y-auto">
              <div className="space-y-3 py-4">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === 0 ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] w-fit rounded-2xl shadow-md text-sm break-words whitespace-pre-wrap ${
                        msg.senderId === 0
                          ? "bg-[#04A7EB] text-white rounded-br-none"
                          : "bg-[#133644] text-white rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                      <div className="text-[10px] text-white/70 mt-1 text-right">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-2 flex gap-2">
              <Textarea
                placeholder="Type your message..."
                className="min-h-[40px] max-h-40 resize-none flex-1"
              />
              <Button>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
