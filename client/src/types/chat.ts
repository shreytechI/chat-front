

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


export interface OnlineUserProps {
  image: string
  name?: string
  isOnline?: boolean
  className?: string
}

export interface UserListRowProps {
  image: string
  name: string
  shortmessage: string
  notifications?: number
  istyping?: boolean
  timestamp?: string
  isOnline?: boolean
  className?: string
  onClick?: () => void
  roomId?: string 
  userId?: string
}

export interface ChatTimestampProps {
  dateTime: string
}

export interface ChatData {
  id: string
  name: string
  image: string
  chat: ChatMessage[]
}

export interface ChatMessage {
  id: string
  text?: string
  dateTime: string
  isOwn?: boolean
  file?: Array<{
    type: "image" | "video" | "audio" | "document"
    url: string
    name?: string
    size?: string
  }>
}

export interface ChatListProps {
  chats: ChatData[]
}

export interface User {
  id: string
  username: string
  email: string
  profileImage?: string 
  isOnline: boolean
  lastSeen: string|null
  createdAt: string
}

export interface Room {
  id: string
  participants: User[]
  isGroup: boolean
  name?: string
  createdAt: string
   lastMessage?: Message
}

export interface Message {
  id: string
  roomId: string
  senderId: string
  text?: string
  media?: {
    url: string
    mimeType?: string
  }
  createdAt: string
}

export interface AuthPayload {
  token: string
  userId: string
}

export interface SignupInput {
  username: string
  email: string
  password: string
  role:string
}

export interface LoginInput {
  email: string
  password: string
}

export interface SendMessageInput {
  roomId: string
  text?: string
  media?: {
    filename: string
    mimetype: string
  }
}
