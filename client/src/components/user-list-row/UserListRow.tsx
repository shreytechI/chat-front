"use client"

import type React from "react"
import type { UserListRowProps } from "@/types/chat"
import OnlineUser from "../online-users/Online-user"

const UserListRow: React.FC<UserListRowProps> = ({
  image,
  name,
  shortmessage,
  notifications = 0,
  istyping = false,
  timestamp,
  isOnline = true,
  className = "",
  onClick,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick?.()
    }
  }

  console.log("time stamp from the userlistrow",timestamp);
  

  return (
    <div
      className={`
        flex items-center
        gap-2 p-2
        sm:gap-2 sm:p-2
        md:gap-3 md:p-3
        lg:gap-3 lg:p-3
        bg-white
        hover:bg-gray-50 transition-all duration-200
        cursor-pointer border-b border-gray-100 last:border-b-0
        ${notifications > 0 ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
        ${className}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Chat with ${name}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {/* Profile Image with Online Status */}
      <div className="flex-shrink-0">
        <OnlineUser
          image={image}
          isOnline={isOnline}
          className="!w-12 !h-14 sm:!w-14 sm:!h-16 md:!w-16 md:!h-18 lg:!w-18 lg:!h-20 !p-1 sm:!p-1.5 md:!p-2 !bg-transparent !border-0 !shadow-none !rounded-xl"
        />
      </div>
      {/* Content Section */}
      <div className="flex-1 min-w-0">
        {/* Name and Timestamp Row */}
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`font-semibold truncate text-sm sm:text-base md:text-lg ${notifications > 0 ? "text-gray-900" : "text-gray-800"}`}
          >
            {name}
          </h3>
          {timestamp && (
            <span
              className={`text-xs sm:text-sm flex-shrink-0 ml-2 ${notifications > 0 ? "text-blue-600 font-medium" : "text-gray-500"}`}
            >
              {timestamp}
            </span>
          )}
        </div>
        {/* Message Row */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {istyping ? (
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm text-blue-600 font-medium">typing</span>
                <div className="flex gap-0.5">
                  <div
                    className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            ) : (
              <p
                className={`text-xs sm:text-sm truncate ${notifications > 0 ? "text-gray-700 font-medium" : "text-gray-600"}`}
              >
                {shortmessage}
              </p>
            )}
          </div>
          {/* Notification Badge */}
          {notifications > 0 && (
            <div
              className="ml-2 flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full min-w-[18px] h-4 sm:min-w-[20px] sm:h-5 md:min-w-[22px] md:h-6 flex items-center justify-center px-1 sm:px-1.5 shadow-lg"
              aria-label={`${notifications} unread messages`}
            >
              {notifications > 99 ? "99+" : notifications}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserListRow
