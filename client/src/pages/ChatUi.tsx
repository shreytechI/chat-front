"use client";
import { useState, useMemo } from "react";
import { BsSearch } from "react-icons/bs";
import type { UserListRowProps, Room, User, Message } from "@/types/chat";
import OnlineUser from "@/components/online-users/Online-user";
import UserListRow from "@/components/user-list-row/UserListRow";
import { ChatWindow } from "@/components/chat-room/ChatWindow";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/contexts/auth-context";

export default function ChatUi() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { rooms, users, messages, selectedRoomId, roomsLoading, messagesLoading, sendMessage, selectRoom } = useChat();

  console.log("users from chat ui ", users);
  console.log("rooms from chat ui", rooms);
  console.log("messages from chat ui ", messages);

  // Convert rooms to UserListRowProps format for the sidebar
  const recentChats: UserListRowProps[] = useMemo(() => {
    return rooms.map((room: Room) => {
      // Find the other participant (not the current user)
      const otherParticipant = room.participants.find((p: User) => p.id !== user?.id);
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

      return {
        image: otherParticipant?.profileImage || "/placeholder.svg?height=150&width=150",
        name: room.isGroup ? room.name || "Group Chat" : otherParticipant?.username || "Unknown User",
        shortmessage: lastMessage?.text || "No messages yet",
        timestamp: lastMessage
          ? new Date(lastMessage.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "",
        isOnline: otherParticipant?.isOnline || false,
        notifications: 0, // TODO: Implement unread count
        onClick: () => selectRoom(room.id),
        roomId: room.id,
      };
    });
  }, [rooms, messages, user?.id, selectRoom]);

  // Get online users for the top bar
  const onlineUsers = useMemo(() => {
    return users
      .filter((u: User) => u.isOnline && u.id !== user?.id)
      .slice(0, 10) // Limit to 10 users
      .map((u: User) => ({
        image: u.profileImage || "/placeholder.svg?height=150&width=150",
        name: u.username,
        isOnline: true,
      }));
  }, [users, user?.id]);

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return recentChats;
    return recentChats
      .filter(
        (chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.shortmessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      });
  }, [recentChats, searchQuery]);

  // Get current room and user data
  const currentRoom = rooms.find((room: Room) => room.id === selectedRoomId);
  const currentChatUser = currentRoom
    ? {
        name: currentRoom.isGroup
          ? currentRoom.name || "Group Chat"
          : currentRoom.participants.find((p: User) => p.id !== user?.id)?.username || "Unknown User",
        image: currentRoom.isGroup
          ? "/placeholder.svg?height=150&width=150"
          : currentRoom.participants.find((p: User) => p.id !== user?.id)?.profileImage || "/placeholder.svg?height=150&width=150",
      }
    : {
        name: "Select a chat",
        image: "/placeholder.svg?height=150&width=150",
      };

  // Convert messages to the format expected by ChatWindow
  const chatData =
    selectedRoomId && messages.length > 0
      ? [
          {
            id: selectedRoomId,
            name: currentChatUser.name,
            image: currentChatUser.image,
            chat: messages.map((msg: Message) => ({
              id: msg.id,
              text: msg.text,
              dateTime: msg.createdAt,
              isOwn: msg.senderId === user?.id,
              file: msg.media
                ? [
                    {
                      type: msg.media.mimeType?.startsWith("image/")
                        ? ("image" as const)
                        : msg.media.mimeType?.startsWith("video/")
                        ? ("video" as const)
                        : msg.media.mimeType?.startsWith("audio/")
                        ? ("audio" as const)
                        : ("document" as const),
                      url: `${process.env.NEXT_PUBLIC_FILES_URL || "http://localhost:4000/uploads"}/${msg.media.url}`,
                      name: msg.media.url,
                      size: undefined,
                    },
                  ]
                : undefined,
            })),
          },
        ]
      : [];

  if (roomsLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-full md:w-2/5 lg:w-1/3 xl:w-1/4 flex-col border-r border-gray-200 bg-white hidden md:flex h-full">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chats</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages or users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-gray-800 pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Online Users */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hidden">
            {onlineUsers.map((user: { image: string; name: string; isOnline: boolean }, index: number) => (
              <OnlineUser
                key={index}
                image={user.image}
                name={user.name}
                isOnline={true}
                className="!w-16 !h-20 !p-1 sm:!w-20 sm:!h-24 md:!w-24 md:!h-28 lg:!w-18 lg:!h-22 flex-shrink-0"
              />
            ))}
            {onlineUsers.length === 0 && <div className="text-sm text-gray-500 py-2">No users online</div>}
          </div>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <h2 className="flex-shrink-0 text-lg ml-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
            Recent {searchQuery && `(${filteredChats.length} results)`}
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            {filteredChats.map((chat: UserListRowProps, index: number) => (
              <UserListRow key={chat.roomId || index} {...chat} className={selectedRoomId === chat.roomId ? "bg-violet-100" : ""} />
            ))}
            {filteredChats.length === 0 && searchQuery && (
              <div className="p-4 text-center text-gray-500">No chats found for &quot;{searchQuery}&quot;</div>
            )}
            {filteredChats.length === 0 && !searchQuery && <div className="p-4 text-center text-gray-500">No chats yet. Start a conversation!</div>}
          </div>
        </div>
      </div>

      {/* Mobile Chat List Overlay */}
      <div className={`md:hidden fixed inset-0 bg-white z-50 flex flex-col ${selectedRoomId === null ? "flex" : "hidden"}`}>
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chats</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages or users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-gray-800 pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto">
            {onlineUsers.map((user: { image: string; name: string; isOnline: boolean }, index: number) => (
              <OnlineUser key={index} image={user.image} name={user.name} isOnline={true} className="!w-16 !h-20 !p-1 flex-shrink-0" />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <h2 className="flex-shrink-0 text-lg ml-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
            Recent {searchQuery && `(${filteredChats.length} results)`}
          </h2>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat: UserListRowProps, index: number) => (
              <UserListRow key={chat.roomId || index} {...chat} className="" />
            ))}
          </div>
        </div>
      </div>

      {/* Right Chat Window */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {selectedRoomId && chatData.length > 0 ? (
          <ChatWindow chats={chatData} currentUser={currentChatUser} onSendMessage={sendMessage} onBack={() => selectRoom("")} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold mb-2">Welcome to Chat</h2>
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
