import { ChatTimestampProps } from '@/types/chat';
import React from 'react';


export const ChatTimestamp: React.FC<ChatTimestampProps> = ({ dateTime }) => {
  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <span className="text-xs opacity-70 text-current flex-shrink-0">
      {formatTime(dateTime)}
    </span>
  );
};