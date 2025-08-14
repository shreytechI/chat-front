import React from 'react';
import {  ChatItem } from './components/Chat-item';
import { ChatListProps } from '@/types/chat';


export const ChatList: React.FC<ChatListProps> = ({ chats }) => {
  return (
    <div className="w-full max-w-4xl mx-auto ">
      {chats.map((chatData, index) => (
        <ChatItem 
          key={`chat-${index}`}
          chatData={chatData}
        />
      ))}
    </div>
  );
};