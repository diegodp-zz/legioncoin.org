// components/Content.tsx
import { ChatForm } from "@/components/ChatForm";
import { ChatMessages } from "@/components/ChatMessages";
import { WhoIsTyping } from "@/components/WhoIsTyping";
import React from "react";
import { ConnectedUsers } from "@/components/ConnectedUsers";

type ContentProps = {
  room: string;
};

export const Content = ({ room }: ContentProps) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="form-control flex-1">
        <div className="flex-1 flex flex-col">
          <ConnectedUsers />
          <ChatMessages />
        </div>
      </div>
      <div className="flex flex-col gap-y-2 mt-2">
        <WhoIsTyping />
        <ChatForm />
      </div>
    </div>
  );
};
