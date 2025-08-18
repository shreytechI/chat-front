import React from 'react';

interface ChatDateSeparatorProps {
  date: string;
}

export const ChatDateSeparator: React.FC<ChatDateSeparatorProps> = ({ date }) => {
  console.log("date from the chat Date Separator ",date);
  
  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-3 py-1 bg-slate-100  rounded-full">
        <span className="text-xs font-medium text-slate-600 ">
          {date}
        </span>
      </div>
    </div>
  );
};