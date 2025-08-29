import type { OnlineUserProps } from "@/types/chat";
import Image from "next/image";
import type React from "react";
import { twMerge } from "tailwind-merge";

const OnlineUser: React.FC<OnlineUserProps> = ({ image, name, isOnline = true, className = "" }) => {
  return (
    <div
      className={twMerge(
        `
      flex flex-col items-center justify-center
      bg-gradient-to-br from-gray-50 to-gray-100
      rounded-2xl shadow-sm border border-gray-200/50
      relative backdrop-blur-sm
      w-10 h-14 
      sm:w-14 sm:h-20 
      md:w-20 md:h-26 
      lg:w-22 lg:h-30 
      p-2 sm:p-3 md:p-4 
      transition-all duration-300 hover:shadow-md
    `,
        className
      )}
      role="img"
      aria-label={`${name || "User"} is ${isOnline ? "online" : "offline"}`}
    >
      {/* Profile Image  */}
      <div className="relative">
        <div
          className={twMerge(
            `
      rounded-full
      overflow-hidden
      shadow-md
      relative
      w-10 h-10 
      sm:w-10 sm:h-10 
      md:w-10 md:h-10 
      lg:w-14 lg:h-14 
      transition-all duration-300
    `,
            isOnline ? "ring-2 ring-green-400" : "ring-2 ring-gray-300"
          )}
        >
          <Image
            src={encodeURI(String(image || "/placeholder.svg").trim())}
            alt={`${name || "User"}'s profile picture`}
            height={40}
            width={40}
            className={`w-full h-full object-cover transition-all duration-300 ${!isOnline ? "grayscale opacity-70" : ""}`}
          />
        </div>
        {/* Online Status Dot */}
        {isOnline ? (
          <div
            className={twMerge(
              `
      absolute -bottom-0.5 -right-0.5
      bg-gradient-to-br from-green-400 to-green-500
      rounded-full
      ring-2 ring-white 
      shadow-lg
      animate-pulse
      w-3.5 h-3.5 
      sm:w-2 sm:h-2 
      md:w-3 md:h-3 
      lg:w-3 lg:h-3 
    `
            )}
            aria-hidden="true"
          />
        ) : (
          <div
            className={twMerge(
              `
      absolute -bottom-0.5 -right-0.5
      bg-gradient-to-br from-gray-400 to-gray-500
      rounded-full
      ring-2 ring-white 
      shadow-lg
      w-3.5 h-3.5 
      sm:w-2 sm:h-2 
      md:w-3 md:h-3 
      lg:w-3 lg:h-3 
    `
            )}
            aria-hidden="true"
          />
        )}
      </div>
      {/* User Name */}
      {name && (
        <span
          className={twMerge(
            `
      font-medium font-sans
      mt-1.5 sm:mt-1
      text-center truncate max-w-full
      tracking-tight
      text-sm 
      sm:text-base 
      md:text-sm 
      lg:text-sm 
      transition-colors duration-300
    `,
            isOnline ? "text-gray-800" : "text-gray-500"
          )}
          title={name}
        >
          {name}
        </span>
      )}
    </div>
  );
};

export default OnlineUser;
