"use client";
import { useState, useMemo } from "react";
import { BsSearch } from "react-icons/bs";
import { ChatData, ChatMessage } from "@/types/chat";
import { UserListRowProps } from "@/types/userListRow";
import { chats as initialChats, onlineUsers } from "@/data/chatUi";
import OnlineUser from "@/components/online-users/Online-user";
import UserListRow from "@/components/user-list-row/UserListRow";
import { ChatWindow } from "@/components/chat-room/ChatWindow";

export default function ChatUi() {
  const [selectedChatIndex, setSelectedChatIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<ChatData[]>(initialChats);

  const handleSendMessage = (message: string, files?: File[]) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: message || undefined,
      dateTime: new Date().toISOString(),
    };

    // Handle file attachments
    if (files && files.length > 0) {
      newMessage.file = files.map((file) => ({
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("audio/")
          ? "audio"
          : "document",
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
    }

    // Add message to the selected chat with isOwn: true
    setChats((prevChats) =>
      prevChats.map((chatData, index) =>
        index === selectedChatIndex
          ? {
              ...chatData,
              chat: [
                ...chatData.chat,
                {
                  ...newMessage,
                  isOwn: true,
                },
              ],
            }
          : chatData
      )
    );
  };

  // Static data for recent chats
  const recentChats: UserListRowProps[] = useMemo(
    () => [
      {
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        name: "Patrick Hendricks",
        shortmessage: "Can we schedule a meeting for tomorrow?",
        timestamp: "9:05 AM",
        isOnline: true,
        notifications: 0,
      },
      {
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        name: "Mark Messer",
        shortmessage: "What do you think about the color scheme?",
        timestamp: "8:40 AM",
        isOnline: true,
        notifications: 2,
      },
      {
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        name: "Doris Brown",
        shortmessage: "Here's my detailed feedback",
        timestamp: "10:10 AM",
        isOnline: false,
        notifications: 0,
      },
      {
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        name: "Albert Rodarte",
        shortmessage: "📎 development-progress.zip",
        timestamp: "11:10 AM",
        isOnline: true,
        notifications: 1,
      },
      {
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        name: "Steve Walker",
        shortmessage: "Let's celebrate this weekend! 🍾",
        timestamp: "2:05 PM",
        isOnline: true,
        notifications: 0,
      },
      {
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        name: "Mirta George",
        shortmessage: "Here's the final result",
        timestamp: "4:10 PM",
        isOnline: false,
        notifications: 3,
      },
    ],
    []
  );

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

  // Get the current chat data based on the selected index
  const currentChatData = selectedChatIndex !== null ? chats[selectedChatIndex] : undefined;
  const currentChatUser = currentChatData
    ? { name: currentChatData.name, image: currentChatData.image }
    : {
        name: "Select a chat",
        image: "/placeholder.svg?height=150&width=150",
      };

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

        {/* Online Users  */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto  scrollbar-hidden">
            {onlineUsers.map((user, index) => (
              <OnlineUser
                key={index}
                image={user.image}
                name={user.name}
                isOnline={true}
                className="!w-16 !h-20 !p-1 sm:!w-20 sm:!h-24 md:!w-24 md:!h-28 lg:!w-18 lg:!h-22 flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Recent Chats  */}
        <div className="flex-1 flex flex-col min-h-0  overflow-hidden">
          <h2 className="flex-shrink-0 text-lg ml-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
            Recent {searchQuery && `(${filteredChats.length} results)`}
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            {filteredChats.map((chat, index) => {
              const originalIndex = recentChats.findIndex((c) => c.name === chat.name);
              return (
                <UserListRow
                  key={index}
                  {...chat}
                  onClick={() => setSelectedChatIndex(originalIndex)}
                  className={selectedChatIndex === originalIndex ? "bg-violet-100" : ""}
                />
              );
            })}
            {filteredChats.length === 0 && searchQuery && (
              <div className="p-4 text-center text-gray-500">No chats found for &quot;{searchQuery}&quot;</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Chat List Overlay */}
      <div className={`md:hidden fixed inset-0 bg-white z-50 flex flex-col ${selectedChatIndex === null ? "flex" : "hidden"}`}>
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
            {onlineUsers.map((user, index) => (
              <OnlineUser key={index} image={user.image} name={user.name} isOnline={true} className="!w-16 !h-20 !p-1 flex-shrink-0" />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <h2 className="flex-shrink-0 text-lg ml-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
            Recent {searchQuery && `(${filteredChats.length} results)`}
          </h2>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat, index) => {
              const originalIndex = recentChats.findIndex((c) => c.name === chat.name);
              return <UserListRow key={index} {...chat} onClick={() => setSelectedChatIndex(originalIndex)} className="" />;
            })}
          </div>
        </div>
      </div>

      {/* Right Chat Window t */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {currentChatData ? (
          <ChatWindow
            chats={[currentChatData]}
            currentUser={currentChatUser}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedChatIndex(null)}
          />
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
