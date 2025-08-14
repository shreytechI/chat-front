"use client"
import { EMOJI_LIST } from "@/data/imoji"
import type { ChatInputProps } from "@/types/chatRoom"
import type React from "react"
import { useState } from "react"
import { BsPaperclip, BsEmojiSmile, BsX } from "react-icons/bs"
import { FiSend } from "react-icons/fi"

export const ChatInput: React.FC<ChatInputProps> = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleKeyPress,
  handleFileClick,
  handleFileChange,
  fileInputRef,
  selectedFiles,
  removeFile,
  onEmojiSelect,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect?.(emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-t-lg shadow-lg max-h-48 overflow-y-auto z-10">
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Choose an emoji</span>
              <button onClick={() => setShowEmojiPicker(false)} className="p-1 hover:bg-gray-100 rounded">
                <BsX className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
              {EMOJI_LIST.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-2 hover:bg-gray-100 rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg border">
                <span className="text-sm text-gray-600 truncate max-w-32">{file.name}</span>
                <button onClick={() => removeFile?.(index)} className="p-1 hover:bg-gray-100 rounded-full">
                  <BsX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-2 sm:p-3 border-t border-slate-200 bg-white">
        <div className="flex items-start gap-1 sm:gap-2 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />

          <div className="flex-1 min-w-0">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter Message..."
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[36px] sm:min-h-[40px] max-h-24 text-sm sm:text-base"
              rows={1}
              style={{
                height: "auto",
                minHeight: "36px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = "auto"
                target.style.height = Math.min(target.scrollHeight, 96) + "px"
              }}
            />
          </div>

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2  cursor-pointer hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
          >
            <BsEmojiSmile className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
          </button>

          <button
            onClick={handleFileClick}
            className="p-2 cursor-pointer hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
          >
            <BsPaperclip className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() && (!selectedFiles || selectedFiles.length === 0)}
            className="p-2 sm:p-3  cursor-pointer bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0"
          >
            <FiSend className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}