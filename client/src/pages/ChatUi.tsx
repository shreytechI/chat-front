"use client";
import { BsSearch, BsWifi, BsWifiOff } from "react-icons/bs";
import OnlineUser from "@/components/online-users/Online-user";
import UserListRow from "@/components/user-list-row/UserListRow";
import { ChatWindow } from "@/components/chat-room/ChatWindow";
import type { UserListRowProps } from "@/types/chat";
import { useChatUiControl } from "@/hooks/useChatUiController";

export default function ChatUi() {
  const {
    searchQuery,
    setSearchQuery,
    totalUnread,
    roomsLoading,
    connectionStatus,
    onlineUsers,
    filteredUsers,
    selectedRoomId,
    currentRoom,
    currentChatUser,
    chatData,
    handleSendMessage,
    selectRoom,
  } = useChatUiControl();

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
      {/* Sidebar */}
      <div className="w-full md:w-2/5 lg:w-1/3 xl:w-1/4 flex-col border-r border-gray-200 bg-white hidden md:flex h-full">
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
            <div className="flex items-center gap-2">
              {connectionStatus === "connected" ? (
                <BsWifi className="w-5 h-5 text-green-500" title="Connected" />
              ) : connectionStatus === "connecting" ? (
                <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" title="Connecting..." />
              ) : (
                <BsWifiOff className="w-5 h-5 text-red-500" title="Disconnected" />
              )}
              {totalUnread > 0 && (
                <div className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </div>
              )}
            </div>
          </div>
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
            {onlineUsers.map((user: { image: string; name: string; isOnline: boolean; onClick?: () => void }, index: number) => (
              <div key={index} onClick={user.onClick} className="cursor-pointer">
                <OnlineUser
                  image={user.image}
                  name={user.name}
                  isOnline={true}
                  className="!w-16 !h-20 !p-1 sm:!w-20 sm:!h-24 md:!w-24 md:!h-28 lg:!w-18 lg:!h-22 flex-shrink-0"
                />
              </div>
            ))}
            {onlineUsers.length === 0 && <div className="text-sm text-gray-500 py-2">No users online</div>}
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <h2 className="flex-shrink-0 text-lg ml-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
            Users {searchQuery && `(${filteredUsers.length} results)`}
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            {filteredUsers.map((userItem: UserListRowProps, index: number) => (
              <UserListRow key={userItem.userId || index} {...userItem} className={selectedRoomId === userItem.roomId ? "bg-violet-100" : ""} />
            ))}
            {filteredUsers.length === 0 && searchQuery && (
              <div className="p-4 text-center text-gray-500">No users found for &quot;{searchQuery}&quot;</div>
            )}
            {filteredUsers.length === 0 && !searchQuery && (
              <div className="p-4 text-center text-gray-500">No users available. Invite friends to chat!</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile User List */}
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
            {onlineUsers.map((user: { image: string; name: string; isOnline: boolean; onClick?: () => void }, index: number) => (
              <div key={index} onClick={user.onClick} className="cursor-pointer">
                <OnlineUser image={user.image} name={user.name} isOnline={true} className="!w-16 !h-20 !p-1 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <h2 className="flex-shrink-0 text-lg ml-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
            Users {searchQuery && `(${filteredUsers.length} results)`}
          </h2>
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.map((userItem: UserListRowProps, index: number) => (
              <UserListRow key={userItem.userId || index} {...userItem} className="" />
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {selectedRoomId && currentRoom ? (
          <ChatWindow chats={chatData} currentUser={currentChatUser} onSendMessage={handleSendMessage} onBack={() => selectRoom("")} />
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
