// pages/index.tsx
"use client";
import React, { useState } from "react";
import SongDisplay from '../components/song-display/SongDisplay';
import '../styles/index.scss';
import { Content } from "@/components/Content";
import ToggleChatButton from "@/components/ToggleChatButton";
import { UsersProvider, useUsers } from "@/providers/Users/UsersProvider";
import { SocketProvider } from "@/providers/Socket/SockerProvider";
import { MessageProvider } from "@/providers/Message/MessageProvider";

const ChatContainer = ({ room }: { room: string }) => {
  return <Content room={room} />;
};

export default function Page() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const room = "general";

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <main className="relative">
      <SocketProvider room={room}>
        <UsersProvider>
          <MessageProvider>
            <SongDisplay />
            <ChatToggleWrapper isChatOpen={isChatOpen} toggleChat={toggleChat} room={room} />
          </MessageProvider>
        </UsersProvider>
      </SocketProvider>
    </main>
  );
}

const ChatToggleWrapper = ({ isChatOpen, toggleChat, room }: { isChatOpen: boolean; toggleChat: () => void; room: string }) => {
  const { users } = useUsers();
  return (
    <>
      <ToggleChatButton onClick={toggleChat} isOpen={isChatOpen} userCount={users.length} />
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-13 h-34 bg-white shadow-lg rounded-tl-lg z-40 overflow-auto chat-container">
          <ChatContainer room={room} />
        </div>
      )}
    </>
  );
};
