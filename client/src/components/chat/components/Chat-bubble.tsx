import type React from "react"
import { BsThreeDotsVertical } from "react-icons/bs"

import type { ChatBubbleProps } from "@/types/chat"
import { ChatFile } from "./Chat-file"
import { ChatTimestamp } from "./Chat-time-stamp"

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isOwn }) => {
  return (
    <div className={isOwn ? "flex justify-end group relative" : "flex justify-start group relative"}>
      <div
        className={
          isOwn
            ? "relative max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 shadow-lg bg-violet-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md"
            : "relative max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 shadow-lg bg-white text-black rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-md"
        }
      >
        {/* Files */}
        {message.file && message.file.length > 0 && (
          <div className="mb-2 space-y-2">
            {message.file.map((file, index) => (
              <ChatFile key={index} file={file} />
            ))}
          </div>
        )}

        {/* Message text */}
        {message.text && (
          <div className="mb-1">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center justify-end gap-1 mt-1">
          <ChatTimestamp dateTime={message.dateTime} />
        </div>
      </div>

      {/* Options button */}
      <button
        className={
          isOwn
            ? "absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-black/10 left-full ml-1"
            : "absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-black/10 right-full mr-1"
        }
      >
        <BsThreeDotsVertical className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  )
}