"use client";

import type React from "react"
import { ChatBubble } from "./Chat-bubble"
import { ChatAvatar } from "./Chat-avatar"
import type { ChatItemProps } from "@/types/chat"

export const ChatItem: React.FC<ChatItemProps> = ({ chatData }) => {
  const { image, name, chat } = chatData

  return (
    <div className="mb-4">
      {chat.map((message, index) => {
        const isOwn = message.isOwn || false

        return (
          <div key={message.id || index} className={`flex gap-2 mb-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          
            {/* Message container */}
            <div className="flex-1 space-y-1 min-w-0">
              {/* User name only show for received messages and first message */}
              {!isOwn && index === 0 && (
                <div className="px-3">
                  <span className="text-sm font-medium text-black">{name}</span>
                </div>
              )}

              {/* Message */}
              <ChatBubble message={message} isOwn={isOwn} />
            </div>
          </div>
        )
      })}
    </div>
  )
}