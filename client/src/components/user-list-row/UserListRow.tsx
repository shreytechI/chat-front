"use client";

import type React from "react";
import type { UserListRowProps } from "@/types/userListRow";
import OnlineUser from "../online-users/Online-user";

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
  return (
    <div
      className={`
        flex items-center
        gap-2 p-2
        sm:gap-2 sm:p-2
        md:gap-3 md:p-3
        lg:gap-3 lg:p-3
        bg-gray-100
        hover:bg-gray-50 transition-colors duration-200
        cursor-pointer border-b border-gray-100 last:border-b-0
        ${className}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Chat with ${name}`}
      onClick={onClick}
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
          <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base md:text-lg">{name}</h3>
          {timestamp && <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">{timestamp}</span>}
        </div>
        {/* Message Row */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {istyping ? (
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm text-blue-600 font-medium">typing</span>
                <div className="flex gap-0.5">
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-600 truncate">{shortmessage}</p>
            )}
          </div>
          {/* Notification Badge */}
          {notifications > 0 && (
            <div
              className="ml-2 flex-shrink-0 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-4 sm:min-w-[20px] sm:h-5 md:min-w-[22px] md:h-6 flex items-center justify-center px-1 sm:px-1.5"
              aria-label={`${notifications} unread messages`}
            >
              {notifications > 99 ? "99+" : notifications}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListRow;
