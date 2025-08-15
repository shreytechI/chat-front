"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { useAuth } from "@/contexts/auth-context";
import type { Message } from "@/types/chat";
import { MESSAGES_QUERY, ROOMS_QUERY, USERS_QUERY } from "@/graphql/queries";
import { CREATE_ROOM_MUTATION, SEND_MESSAGE_MUTATION } from "@/graphql/mutations";
import { MESSAGE_ADDED_SUBSCRIPTION, USER_STATUS_CHANGED_SUBSCRIPTION } from "@/graphql/subscriptions";
import { uploadFile } from "@/lib/file-upload";

export function useChat() {
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch rooms
  const {
    data: roomsData,
    loading: roomsLoading,
    refetch: refetchRooms,
  } = useQuery(ROOMS_QUERY, {
    skip: !user,
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

  // Subscribe to new messages
  useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: { roomId: selectedRoomId! },
    skip: !selectedRoomId,
    onData: ({ data }) => {
      if (data.data?.messageAdded) {
        setMessages((prev) => [...prev, data.data.messageAdded]);
      }
    },
  });

  // Subscribe to user status changes
  useSubscription(USER_STATUS_CHANGED_SUBSCRIPTION, {
    skip: !user,
    onData: () => {
      refetchUsers();
    },
  });

  // Update messages when data changes
  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData]);

  const sendMessage = async (text: string, files?: File[]) => {
    if (!selectedRoomId || (!text.trim() && (!files || files.length === 0))) return;

    try {
      // Handle file upload if files are present
      let mediaData = undefined;
      if (files && files.length > 0) {
        // Upload the first file only for now
        const file = files[0];
        const uploadResult = await uploadFile(file);
        mediaData = {
          filename: uploadResult.filename,
          mimetype: uploadResult.mimetype,
        };
      }

      await sendMessageMutation({
        variables: {
          input: {
            roomId: selectedRoomId,
            text: text.trim() || undefined,
            media: mediaData,
          },
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error; // Re-throw to let the UI handle the error
    }
  };

  const createRoom = async (participantIds: string[], isGroup = false, name?: string) => {
    try {
      const { data } = await createRoomMutation({
        variables: {
          participantIds,
          isGroup,
          name,
        },
      });

      if (data?.createRoom) {
        await refetchRooms();
        return data.createRoom;
      }
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  };

  const selectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  return {
    // Data
    rooms: roomsData?.rooms || [],
    users: usersData?.users || [],
    messages,
    selectedRoomId,

    // Loading states
    roomsLoading,
    messagesLoading,

    // Actions
    sendMessage,
    createRoom,
    selectRoom,
    refetchRooms,
    refetchMessages,
  };
}
