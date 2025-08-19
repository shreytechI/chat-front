"use client";
import { useState, useMemo, useEffect } from "react";
import type { UserListRowProps, Room, User, Message } from "@/types/chat";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/contexts/auth-context";
import { formatTime } from "@/utils/dateUtils";

export function useChatUiControl() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const {
    rooms,
    users,
    messages,
    selectedRoomId,
    roomsLoading,
    sendMessage,
    selectRoom,
    unreadCounts,
    roomLatestMessages,
    connectionStatus,
    findOrCreateDirectRoom,
  } = useChat();

  useEffect(() => {
    if (user) {
      console.log(" User entered chat UI, setting online status");
    }
  }, [user]);

  const totalUnread = useMemo(() => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  }, [unreadCounts]);

  useEffect(() => {
    document.title = totalUnread > 0 ? `(${totalUnread}) Chat App` : "Chat App";
  }, [totalUnread]);

  const handleUserClick = async (userId: string) => {
    try {
      console.log(" User clicked, userId:", userId);

      const existingRoom = rooms.find(
        (room: Room) =>
          !room.isGroup &&
          room.participants.some((p: User) => p.id === userId)
      );

      if (existingRoom) {
        console.log(" Found existing room:", existingRoom.id);
        selectRoom(existingRoom.id);
      } else {
        console.log(" Creating new room for user:", userId);
        const newRoom = await findOrCreateDirectRoom(userId);
        if (newRoom) {
          console.log(" Created/found room:", newRoom.id);
        } else {
          console.error(" Failed to create room");
          alert("Failed to create chat room. Please try again.");
        }
      }
    } catch (error) {
      console.error(" Error creating/selecting room:", error);
      alert("Error opening chat. Please try again.");
    }
  };

  const handleSendMessage = async (message: string, files?: File[]) => {
    if (!selectedRoomId) {
      console.error(" No room selected for sending message");
      throw new Error("No room selected");
    }
    const media = files && files.length > 0 ? files[0] : undefined;
    return await sendMessage(selectedRoomId, message, media);
  };

  const userList: UserListRowProps[] = useMemo(() => {
    return users
      .filter((u: User) => u.id !== user?.id)
      .map((u: User) => {
        const existingRoom = rooms.find(
          (room: Room) =>
            !room.isGroup &&
            room.participants.some((p: User) => p.id === u.id)
        );
        const lastMessage = existingRoom
          ? roomLatestMessages[existingRoom.id]
          : null;

        return {
          image:
            u.profileImage ||
            "https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=880",
          name: u.username,
          shortmessage: lastMessage?.text || "Click to start chatting",
          timestamp: lastMessage ? formatTime(lastMessage.createdAt) : "",
          isOnline: u.isOnline,
          notifications: existingRoom ? unreadCounts[existingRoom.id] || 0 : 0,
          onClick: () => handleUserClick(u.id),
          userId: u.id,
          roomId: existingRoom?.id,
        };
      });
  }, [users, rooms, roomLatestMessages, unreadCounts, user?.id]);

  const onlineUsers = useMemo(() => {
    return users
      .filter((u: User) => u.isOnline && u.id !== user?.id)
      .slice(0, 10)
      .map((u: User) => ({
        image: u.profileImage || "/placeholder.svg?height=150&width=150",
        name: u.username,
        isOnline: true,
        onClick: () => handleUserClick(u.id),
      }));
  }, [users, user?.id]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return userList;
    return userList
      .filter(
        (userItem) =>
          userItem.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          userItem.shortmessage
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const aNameMatch = a.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const bNameMatch = b.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return 0;
      });
  }, [userList, searchQuery]);

  const currentRoom = rooms.find((room: Room) => room.id === selectedRoomId);
  const currentChatUser = currentRoom
    ? {
        name: currentRoom.isGroup
          ? currentRoom.name || "Group Chat"
          : currentRoom.participants.find((p: User) => p.id !== user?.id)
              ?.username || "Unknown User",
        image:
          currentRoom.participants.find((p: User) => p.id !== user?.id)
            ?.profileImage ||
          "https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=880",
        isOnline: currentRoom.participants.find((p: User) => p.id !== user?.id)
          ?.isOnline,
        lastSeen: currentRoom.participants.find((p: User) => p.id !== user?.id)
          ?.lastSeen,
      }
    : {
        name: "Select a chat",
        image: "",
      };

  const chatData = useMemo(() => {
    if (!selectedRoomId || !currentRoom) return [];

    console.log(
      " Generating chat data for room:",
      selectedRoomId,
      "messages count:",
      messages.length
    );

    return [
      {
        id: selectedRoomId,
        name: currentChatUser.name,
        image: currentChatUser.image,
        chat: messages.map((msg: Message) => {
          let file;
          if (msg.media && msg.media.url) {
            file = [
              {
                type: msg.media.mimeType?.startsWith("image/")
                  ? ("image" as const)
                  : msg.media.mimeType?.startsWith("video/")
                  ? ("video" as const)
                  : msg.media.mimeType?.startsWith("audio/")
                  ? ("audio" as const)
                  : ("document" as const),
                url: `${
                  process.env.NEXT_PUBLIC_FILES_URL ||
                  "http://localhost:4000/uploads"
                }/${msg.media.url}`,
                name: msg.media.url,
                size: "10mb dum",
              },
            ];
          }

          return {
            id: msg.id,
            text: msg.text || "",
            dateTime: msg.createdAt,
            isOwn: msg.senderId === user?.id,
            file,
          };
        }),
      },
    ];
  }, [selectedRoomId, currentRoom, messages, currentChatUser, user?.id]);

  return {
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
  };
}
