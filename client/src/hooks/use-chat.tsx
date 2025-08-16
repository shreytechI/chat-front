"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useSubscription, useLazyQuery } from "@apollo/client";

import { useAuth } from "@/contexts/auth-context";
import { uploadFile } from "@/lib/file-upload";
import type { Message, Room } from "@/types/chat";
import { FIND_OR_CREATE_ROOM_QUERY, MESSAGES_QUERY, ROOMS_QUERY, USERS_QUERY } from "@/graphql/queries";
import { CREATE_ROOM_MUTATION, SEND_MESSAGE_MUTATION } from "@/graphql/mutations";
import {
  ALL_ROOMS_MESSAGE_SUBSCRIPTION,
  MESSAGE_ADDED_SUBSCRIPTION,
  ROOM_UPDATED_SUBSCRIPTION,
  USER_STATUS_CHANGED_SUBSCRIPTION,
} from "@/graphql/subscriptions";

export function useChat() {
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [roomLatestMessages, setRoomLatestMessages] = useState<Record<string, Message>>({});
  const [newMessageSound, setNewMessageSound] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connecting");

  // Fetch rooms
  const {
    data: roomsData,
    loading: roomsLoading,
    refetch: refetchRooms,
  } = useQuery(ROOMS_QUERY, {
    skip: !user,
    onCompleted: () => setConnectionStatus("connected"),
    onError: () => setConnectionStatus("disconnected"),
  });

  // Fetch users for online status
  const { data: usersData, refetch: refetchUsers } = useQuery(USERS_QUERY, {
    skip: !user,
  });

  // Fetch messages for selected room
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery(MESSAGES_QUERY, {
    variables: { roomId: selectedRoomId!, limit: 50 },
    skip: !selectedRoomId,
  });

  // Mutations
  const [sendMessageMutation] = useMutation(SEND_MESSAGE_MUTATION);
  const [createRoomMutation] = useMutation(CREATE_ROOM_MUTATION);

  const [findOrCreateRoom] = useLazyQuery(FIND_OR_CREATE_ROOM_QUERY);

  // Subscribe to new messages for selected room only
  useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: { roomId: selectedRoomId! },
    skip: !selectedRoomId,
    onData: ({ data }) => {
      if (data.data?.messageAdded) {
        console.log("[v0] New message received for selected room:", data.data.messageAdded);
        setMessages((prev) => [...prev, data.data.messageAdded]);
      }
    },
  });

  useSubscription(ALL_ROOMS_MESSAGE_SUBSCRIPTION, {
    skip: !user,
    onData: ({ data }) => {
      if (data.data?.messageAddedToUserRooms) {
        const newMessage = data.data.messageAddedToUserRooms;
        console.log("[v0] New message in room:", newMessage.roomId);

        // Update latest message for the room
        setRoomLatestMessages((prev) => ({
          ...prev,
          [newMessage.roomId]: newMessage,
        }));

        // If message is not from current user and not in selected room, increment unread count
        if (newMessage.senderId !== user?.id && newMessage.roomId !== selectedRoomId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [newMessage.roomId]: (prev[newMessage.roomId] || 0) + 1,
          }));

          setNewMessageSound(true);
        }

        // If message is in currently selected room, add to messages
        if (newMessage.roomId === selectedRoomId) {
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((msg) => msg.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      }
    },
  });

  useSubscription(ROOM_UPDATED_SUBSCRIPTION, {
    skip: !user,
    onData: ({ data }) => {
      if (data.data?.roomUpdated) {
        console.log("[v0] Room updated:", data.data.roomUpdated);
        refetchRooms();
      }
    },
  });

  useSubscription(USER_STATUS_CHANGED_SUBSCRIPTION, {
    skip: !user,
    onData: ({ data }) => {
      console.log("[v0] User status changed:", data.data?.userStatusChanged);
      refetchUsers();
    },
  });

  useEffect(() => {
    if (messagesData?.messages) {
      console.log("[v0] Messages data updated for room:", selectedRoomId, "count:", messagesData.messages.length);
      setMessages(messagesData.messages);
    }
  }, [messagesData, selectedRoomId]);

  const selectRoom = useCallback(
    (roomId: string) => {
      console.log("[v0] Selecting room:", roomId);
      setSelectedRoomId(roomId);

      // Clear messages when switching rooms to avoid showing old messages
      if (roomId !== selectedRoomId) {
        setMessages([]);
      }

      if (roomId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [roomId]: 0,
        }));
      }
    },
    [selectedRoomId]
  );

  useEffect(() => {
    if (roomsData?.rooms) {
      const latestMessages: Record<string, Message> = {};
      roomsData.rooms.forEach((room: Room) => {
        if (room.lastMessage) {
          latestMessages[room.id] = room.lastMessage;
        }
      });
      setRoomLatestMessages((prev) => ({ ...prev, ...latestMessages }));
    }
  }, [roomsData]);

  const handleSoundPlayed = useCallback(() => {
    setNewMessageSound(false);
  }, []);

  // <CHANGE> Fixed sendMessage to accept roomId as first parameter and properly handle the backend input format
  const sendMessage = async (roomId: string, text: string, media?: File) => {
    console.log("[v0] sendMessage called with roomId:", roomId, "text:", text, "media:", media);

    if (!roomId) {
      console.error("[v0] Cannot send message: No room ID provided");
      throw new Error("Room ID is required");
    }

    if (!text.trim() && !media) {
      console.error("[v0] Cannot send message: No content provided");
      return;
    }

    try {
      console.log("[v0] Sending message to room:", roomId, "text:", text);

      // Handle file upload if media is present
      let mediaData = undefined;
      if (media) {
        const uploadResult = await uploadFile(media);
        mediaData = {
          filename: uploadResult.filename,
          mimetype: uploadResult.mimetype,
        };
      }

      const res = await sendMessageMutation({
        variables: {
          input: {
            roomId: roomId,
            text: text.trim() || undefined,
            media: mediaData,
          },
        },
      });

      console.log("[v0] Message sent successfully");
    } catch (error) {
      console.error("[v0] Error sending message:", error);
      throw error;
    }
  };

  const createRoom = async (participantIds: string[], isGroup = false, name?: string) => {
    try {
      console.log("[v0] Creating room with participants:", participantIds);
      const { data } = await createRoomMutation({
        variables: {
          participantIds,
          isGroup,
          name,
        },
      });

      if (data?.createRoom) {
        console.log("[v0] Room created successfully:", data.createRoom.id);
        await refetchRooms();
        return data.createRoom;
      }
    } catch (error) {
      console.error("[v0] Error creating room:", error);
      throw error;
    }
  };

  const findOrCreateDirectRoom = async (participantId: string) => {
    try {
      console.log("[v0] Finding or creating direct room with participant:", participantId);
      const { data } = await findOrCreateRoom({
        variables: { participantId },
      });

      if (data?.findOrCreateRoom) {
        console.log("[v0] Direct room found/created:", data.findOrCreateRoom.id);
        await refetchRooms();

        const roomId = data.findOrCreateRoom.id;
        console.log("[v0] Immediately selecting room:", roomId);
        setSelectedRoomId(roomId);
        setUnreadCounts((prev) => ({
          ...prev,
          [roomId]: 0,
        }));

        return data.findOrCreateRoom;
      } else {
        console.error("[v0] No room data returned from findOrCreateRoom");
        return null;
      }
    } catch (error) {
      console.error("[v0] Error finding/creating room:", error);
      throw error;
    }
  };

  return {
    // Data
    rooms: roomsData?.rooms || [],
    users: usersData?.users || [],
    messages,
    selectedRoomId,
    unreadCounts,
    roomLatestMessages,
    newMessageSound,
    typingUsers,
    connectionStatus,

    // Loading states
    roomsLoading,
    messagesLoading,

    // Actions
    sendMessage,
    createRoom,
    findOrCreateDirectRoom,
    selectRoom,
    refetchRooms,
    refetchMessages,
    handleSoundPlayed,
  };
}
