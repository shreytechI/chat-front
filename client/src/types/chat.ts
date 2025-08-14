

export interface ChatAvatarProps {
  src: string;
  alt: string;
}


export interface ChatFilePropss {
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  name?: string;
  size?: string;
}

export interface ChatFileProps {
  file: ChatFilePropss;
}



export interface ChatTimestampProps {
  dateTime: string;
}



export interface ChatMessage {
  text?: string;
  dateTime: string;
  file?: ChatFilePropss[];
  id?: string;
  isOwn?: boolean
}

export interface ChatBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}




export interface ChatData {
  image: string;
  name: string;
  replyTo?: ChatMessage[];
  chat: ChatMessage[];
  isOwn?: boolean;
}

export interface ChatItemProps {
  chatData: ChatData;
}


export interface ChatListProps {
  chats: ChatData[];
}