import { ChatAvatarProps } from '@/types/chat';
import Image from 'next/image';
import React from 'react';



export const ChatAvatar: React.FC<ChatAvatarProps> = ({ src, alt }) => {
  return (
    <div
      className="
        w-6 h-6 
        sm:w-7 sm:h-7 
        md:w-8 md:h-8 
        lg:w-10 lg:h-10 
        rounded-full overflow-hidden flex-shrink-0
      "
    >
      <Image
        src={src}
        alt={alt}
        width={40} 
        height={40} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};