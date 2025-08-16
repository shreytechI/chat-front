"use client"
import { useState, useMemo, useEffect } from "react"
import { BsSearch, BsWifi, BsWifiOff } from "react-icons/bs"
import type { UserListRowProps, Room, User, Message } from "@/types/chat"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/contexts/auth-context"
import OnlineUser from "@/components/online-users/Online-user"
import UserListRow from "@/components/user-list-row/UserListRow"
import { ChatWindow } from "@/components/chat-room/ChatWindow"

export default function ChatUi() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const {
    rooms,
    users,
    messages,
    selectedRoomId,
    roomsLoading,
    messagesLoading,
    sendMessage,
    selectRoom,
    unreadCounts,
    roomLatestMessages,
    newMessageSound,
    typingUsers,
    connectionStatus,
    handleSoundPlayed,
    findOrCreateDirectRoom,
  } = useChat()

  useEffect(() => {
    if (user) {
      console.log("[v0] User entered chat UI, setting online status")
    }
  }, [user])

  const totalUnread = useMemo(() => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)
  }, [unreadCounts])

  useEffect(() => {
    document.title = totalUnread > 0 ? `(${totalUnread}) Chat App` : "Chat App"
  }, [totalUnread])

  const userList: UserListRowProps[] = useMemo(() => {
    return users
      .filter((u: User) => u.id !== user?.id) // Exclude current user
      .map((u: User) => {
        // Find existing room with this user
        const existingRoom = rooms.find(
          (room: Room) => !room.isGroup && room.participants.some((p: User) => p.id === u.id),
        )
        const lastMessage = existingRoom ? roomLatestMessages[existingRoom.id] : null

        return {
          image: u.profileImage || "/placeholder.svg?height=150&width=150",
          name: u.username,
          shortmessage: lastMessage?.text || "Click to start chatting",
          timestamp: lastMessage
            ? new Date(lastMessage.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "",
          isOnline: u.isOnline,
          notifications: existingRoom ? unreadCounts[existingRoom.id] || 0 : 0,
          onClick: () => handleUserClick(u.id),
          userId: u.id,
          roomId: existingRoom?.id,
        }
      })
  }, [users, rooms, roomLatestMessages, unreadCounts, user?.id])

  const handleUserClick = async (userId: string) => {
    try {
      console.log("[v0] User clicked, userId:", userId)

      // Check if room already exists
      const existingRoom = rooms.find(
        (room: Room) => !room.isGroup && room.participants.some((p: User) => p.id === userId),
      )

      if (existingRoom) {
        console.log("[v0] Found existing room:", existingRoom.id)
        selectRoom(existingRoom.id)
      } else {
        console.log("[v0] Creating new room for user:", userId)
        const newRoom = await findOrCreateDirectRoom(userId)
        if (newRoom) {
          console.log("[v0] Created/found room:", newRoom.id)
        } else {
          console.error("[v0] Failed to create room")
          alert("Failed to create chat room. Please try again.")
        }
      }
    } catch (error) {
      console.error("[v0] Error creating/selecting room:", error)
      alert("Error opening chat. Please try again.")
    }
  }

  const handleSendMessage = async (message: string, files?: File[]) => {
    console.log("reached the handle send message function ",selectedRoomId," mes",message);
    
    if (!selectedRoomId) {
      console.error("[v0] No room selected for sending message")
      throw new Error("No room selected")
    }

    console.log("[v0] Sending message to room:", selectedRoomId, "text:", message)

    const media = files && files.length > 0 ? files[0] : undefined

    return await sendMessage(selectedRoomId, message, media)
  }

  const onlineUsers = useMemo(() => {
    return users
      .filter((u: User) => u.isOnline && u.id !== user?.id)
      .slice(0, 10)
      .map((u: User) => ({
        image: u.profileImage || "/placeholder.svg?height=150&width=150",
        name: u.username,
        isOnline: true,
        onClick: () => handleUserClick(u.id),
      }))
  }, [users, user?.id])

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return userList
    return userList
      .filter(
        (userItem) =>
          userItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          userItem.shortmessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase())
        const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase())
        if (aNameMatch && !bNameMatch) return -1
        if (!aNameMatch && bNameMatch) return 1
        // Sort online users first
        if (a.isOnline && !b.isOnline) return -1
        if (!a.isOnline && b.isOnline) return 1
        return 0
      })
  }, [userList, searchQuery])

  const currentRoom = rooms.find((room: Room) => room.id === selectedRoomId)
  const currentChatUser = currentRoom
    ? {
        name: currentRoom.isGroup
          ? currentRoom.name || "Group Chat"
          : currentRoom.participants.find((p: User) => p.id !== user?.id)?.username || "Unknown User",
        image: currentRoom.isGroup
          ? "/placeholder.svg?height=150&width=150"
          : currentRoom.participants.find((p: User) => p.id !== user?.id)?.profileImage ||
            "/placeholder.svg?height=150&width=150",
      }
    : {
        name: "Select a chat",
        image: "/placeholder.svg?height=150&width=150",
      }

  const chatData = useMemo(() => {
    if (!selectedRoomId || !currentRoom) return []

    console.log("[v0] Generating chat data for room:", selectedRoomId, "messages count:", messages.length)

    return [
      {
        id: selectedRoomId,
        name: currentChatUser.name,
        image: currentChatUser.image,
        chat: messages.map((msg: Message) => ({
          id: msg.id,
          text: msg.text || "",
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
  }, [selectedRoomId, currentRoom, messages, currentChatUser, user?.id])

  if (roomsLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading chats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* <NotificationSound shouldPlay={newMessageSound} onPlayed={handleSoundPlayed} /> */}

      <div className="w-full md:w-2/5 lg:w-1/3 xl:w-1/4 flex-col border-r border-gray-200 bg-white hidden md:flex h-full">
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
            <div className="flex items-center gap-2">
              {connectionStatus === "connected" ? (
                <BsWifi className="w-5 h-5 text-green-500" title="Connected" />
              ) : connectionStatus === "connecting" ? (
                <div
                  className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"
                  title="Connecting..."
                />
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

        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hidden">
            {onlineUsers.map(
              (user: { image: string; name: string; isOnline: boolean; onClick?: () => void }, index: number) => (
                <div key={index} onClick={user.onClick} className="cursor-pointer">
                  <OnlineUser
                    image={user.image}
                    name={user.name}
                    isOnline={true}
                    className="!w-16 !h-20 !p-1 sm:!w-20 sm:!h-24 md:!w-24 md:!h-28 lg:!w-18 lg:!h-22 flex-shrink-0"
                  />
                </div>
              ),
            )}
            {onlineUsers.length === 0 && <div className="text-sm text-gray-500 py-2">No users online</div>}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <h2 className="flex-shrink-0 text-lg ml-4 py-2 font-semibold text-gray-900 border-b border-gray-200">
            Users {searchQuery && `(${filteredUsers.length} results)`}
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            {filteredUsers.map((userItem: UserListRowProps, index: number) => (
              <UserListRow
                key={userItem.userId || index}
                {...userItem}
                className={selectedRoomId === userItem.roomId ? "bg-violet-100" : ""}
              />
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

      <div
        className={`md:hidden fixed inset-0 bg-white z-50 flex flex-col ${selectedRoomId === null ? "flex" : "hidden"}`}
      >
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
            {onlineUsers.map(
              (user: { image: string; name: string; isOnline: boolean; onClick?: () => void }, index: number) => (
                <div key={index} onClick={user.onClick} className="cursor-pointer">
                  <OnlineUser
                    image={user.image}
                    name={user.name}
                    isOnline={true}
                    className="!w-16 !h-20 !p-1 flex-shrink-0"
                  />
                </div>
              ),
            )}
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

      <div className="flex-1 flex flex-col h-full min-w-0">
        {selectedRoomId && currentRoom ? (
          <>
            <ChatWindow
              chats={chatData}
              currentUser={currentChatUser}
              onSendMessage={handleSendMessage}
              onBack={() => selectRoom("")}
              // loading={messagesLoading}
            />
            {/* {selectedRoomId && typingUsers[selectedRoomId] && <TypingIndicator users={typingUsers[selectedRoomId]} />} */}
          </>
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
  )
}
