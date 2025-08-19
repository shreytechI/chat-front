"use client";

import { ChatFileProps } from '@/types/chat';
import Image from 'next/image';
import React from 'react';
import { FiDownload, FiImage, FiFile, FiVideo, FiMusic } from 'react-icons/fi';



export const ChatFile: React.FC<ChatFileProps> = ({ file }) => {
  const getFileIcon = () => {
    switch (file.type) {
      case 'image':
        return <FiImage className="w-4 h-4" />;
      case 'video':
        return <FiVideo className="w-4 h-4" />;
      case 'audio':
        return <FiMusic className="w-4 h-4" />;
      default:
        return <FiFile className="w-4 h-4" />;
    }
  };

  if (file.type === 'image') {
    return (
      <div className="relative rounded-lg overflow-hidden max-w-xs">
        <Image
          src={file.url}
          alt="Shared image"
          width={400}
          height={400}
          className="w-full h-auto max-h-64 object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-100  rounded-lg max-w-xs">
      <div className="flex-shrink-0 p-2 bg-violet-600/10 rounded-full">
        {getFileIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black  truncate">
          {file.name || 'Unknown file'}
        </p>
        {file.size && (
          <p className="text-xs text-gray-600 ">
            {file.size}
          </p>
        )}
      </div>
      <button className="flex-shrink-0 p-1 hover:bg-violet-600/10 rounded-full transition-colors">
        <FiDownload className="w-4 h-4 text-gray-600 " />
      </button>
    </div>
  );
};