"use client";
import type React from "react";
import { useState, useRef } from "react";
import { ChatHeader } from "./components/Chat-room-header";
import { ChatWithDates } from "./components/Chat-list-date";
import type { ChatWindowProps } from "@/types/chatRoom";
import { ChatInput } from "./components/Chat-room-input";

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chats,
  currentUser,
  onSendMessage,
  onBack,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if ((messageInput.trim() || selectedFiles.length > 0) && onSendMessage) {
      onSendMessage(messageInput.trim(), selectedFiles);
      setMessageInput("");
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white overflow-hidden">
      {/* Header */}
      <ChatHeader currentUser={currentUser} onBack={onBack} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <ChatWithDates chats={chats} />
      </div>

      {/* Input Area */}
      <ChatInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
        handleFileClick={handleFileClick}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        selectedFiles={selectedFiles}
        removeFile={removeFile}
        onEmojiSelect={handleEmojiSelect}
      />
    </div>
  );
};
