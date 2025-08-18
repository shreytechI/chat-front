"use client";

import { ChatTimestampProps } from "@/types/chat";
import React from "react";

export const ChatTimestamp: React.FC<ChatTimestampProps> = ({ dateTime }) => {
  const formatTime = (dateValue: string | number) => {
    // Convert string timestamp → number, else keep as-is
    const timestamp = typeof dateValue === "string" ? Number(dateValue) : dateValue;
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateValue);
      return "";
    }

    // Only return time like "06:04 PM"
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <span className="text-xs opacity-70 text-current flex-shrink-0">
      {formatTime(dateTime)}
    </span>
  );
};
