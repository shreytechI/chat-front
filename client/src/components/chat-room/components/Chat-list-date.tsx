import React from "react";

import { ChatData } from "@/types/chat";
import { ChatDateSeparator } from "./Chat-date-separator";
import { ChatList } from "@/components/chat/ChatList";

interface ChatWithDatesProps {
  chats: ChatData[];
}

export const ChatWithDates: React.FC<ChatWithDatesProps> = ({ chats }) => {
  const getDateLabel = (dateValue: string | number): string => {
    // Handle both ISO string & timestamp
    const timestamp = typeof dateValue === "string" ? Number(dateValue) : dateValue;
    const messageDate = new Date(timestamp);

    if (isNaN(messageDate.getTime())) {
      console.warn("Invalid date received:", dateValue);
      return "Invalid Date";
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDateStr = messageDate.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    if (messageDateStr === todayStr) {
      return "Today";
    } else if (messageDateStr === yesterdayStr) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const groupChatsByDate = () => {
    const grouped: Array<{ type: "separator"; date: string } | { type: "chat"; data: ChatData }> = [];
    let currentDate = "";

    chats.forEach((chat) => {
      // Get the date of the first message in this chat
      const firstMessageDate = chat.chat[0]?.dateTime;
      if (firstMessageDate) {
        const dateLabel = getDateLabel(firstMessageDate);

        if (dateLabel !== currentDate) {
          currentDate = dateLabel;
          grouped.push({ type: "separator", date: dateLabel });
        }
      }

      grouped.push({ type: "chat", data: chat });
    });

    return grouped;
  };

  const groupedChats = groupChatsByDate();
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {groupedChats.map((item, index) => {
        if (item.type === "separator") {
          return <ChatDateSeparator key={`separator-${index}`} date={item.date} />;
        } else {
          return (
            <div key={`chat-${index}`} className="mb-6">
              <ChatList chats={[item.data]} />
            </div>
          );
        }
      })}
    </div>
  );
};
