"use client";

import type { ChatHeaderProps } from "@/types/chatRoom";
import { formatLastSeen } from "@/utils/dateUtils";
import Image from "next/image";
import type React from "react";
import { BsSearch, BsThreeDotsVertical, BsTelephone, BsCameraVideo, BsArrowLeft } from "react-icons/bs";
import { LuUserRoundPlus } from "react-icons/lu";

export const ChatHeader: React.FC<ChatHeaderProps> = ({ currentUser, onBack }) => {
  
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3">
        {/* Back button for mobile */}
        {onBack && (
          <button onClick={onBack} className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors">
            <BsArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        )}

        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src={currentUser.image || "/placeholder.svg"} alt={currentUser.name} width={40} height={40} className="w-full h-full object-cover" />
        </div>

        <div>
          <h2 className="font-semibold text-sm sm:text-base text-slate-900">{currentUser.name}</h2>
          <div className="flex items-center gap-1">
            {currentUser.isOnline ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-slate-500">Online</span>
              </>
            ) : (
              <span className="text-xs text-slate-500">Last seen {formatLastSeen(currentUser.lastSeen)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <BsSearch className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors sm:block">
          <BsTelephone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors sm:block">
          <BsCameraVideo className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors sm:block">
          <LuUserRoundPlus className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <BsThreeDotsVertical className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
