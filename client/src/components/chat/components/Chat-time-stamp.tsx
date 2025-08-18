"use client";

import { ChatTimestampProps } from "@/types/chat";
import React from "react";
import { formatTime } from "@/utils/dateUtils";

export const ChatTimestamp: React.FC<ChatTimestampProps> = ({ dateTime }) => {
  return (
    <span className="text-xs opacity-70 text-current flex-shrink-0">
      {formatTime(dateTime)}
    </span>
  );
};
