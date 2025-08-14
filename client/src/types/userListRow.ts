export interface UserListRowProps {
  image: string;
  name: string;
  shortmessage: string;
  notifications?: number;
  istyping?: boolean;
  timestamp?: string;
  isOnline?: boolean;
  className?: string;
  onClick?: () => void 
}