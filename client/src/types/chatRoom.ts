import { ChatData } from "./chat";

export interface ChatWindowProps {
  chats: ChatData[]
  currentUser: {
    name: string
    image: string
    isOnline?:boolean
    lastSeen?:string
  }
  onSendMessage: (message: string, files?: File[]) => Promise<void>
  onBack: () => void
}

export interface ChatHeaderProps {
  currentUser: {
    name: string;
    image: string;
    isOnline?:boolean
    lastSeen?:string
  };
  onBack?: () => void;
}

export interface ChatInputProps {
  messageInput: string;
  setMessageInput: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress?: (e: React.KeyboardEvent) => void;
  handleFileClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedFiles?: File[];
  removeFile?: (index: number) => void;
  onEmojiSelect?: (emoji: string) => void;
}
