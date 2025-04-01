"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Chat({ id }: { id: string }) {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    [],
  );
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { user: "Você", text: message }]);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col w-full h-[calc(100vh-180px)] overflow-y-auto mt-5 p-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mt-5 w-full flex gap-2 items-end ${
              msg.user === "Você" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.user !== "Você" && (
              <Avatar className="w-10 h-10">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`p-3 max-w-96 text-white rounded-2xl ${
                msg.user === "Você"
                  ? "bg-blue-500 text-end rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
            >
              <h4 className="font-bold text-xs">{msg.user}</h4>
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.user === "Você" && (
              <Avatar className="w-10 h-10">
                <AvatarImage src="" alt="Você" />
                <AvatarFallback>RT</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white flex items-center justify-between p-2 w-full h-12 rounded-lg mt-auto">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-none focus:ring-0 focus:outline-none"
          style={{ boxShadow: "none" }}
        />
        <Send
          onClick={handleSendMessage}
          className="mr-3 text-gray-500 cursor-pointer"
        />
      </div>
    </div>
  );
}
