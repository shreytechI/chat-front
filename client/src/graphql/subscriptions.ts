import { gql } from "@apollo/client"

// Real-time Subscriptions
export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription MessageAdded($roomId: ID!) {
    messageAdded(roomId: $roomId) {
      id
      roomId
      senderId
      text
      media {
        url
        mimeType
      }
      createdAt
    }
  }
`

export const ALL_ROOMS_MESSAGE_SUBSCRIPTION = gql`
  subscription AllRoomsMessages {
    messageAddedToUserRooms {
      id
      roomId
      senderId
      text
      media {
        url
        mimeType
      }
      createdAt
    }
  }
`

export const ROOM_UPDATED_SUBSCRIPTION = gql`
  subscription RoomUpdated {
    roomUpdated {
      id
      participants {
        id
        username
        email
        profileImage
        isOnline
      }
      isGroup
      name
      createdAt
      lastMessage {
        id
        text
        createdAt
        senderId
      }
    }
  }
`

export const USER_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription UserStatusChanged($userId: ID) {
    userStatusChanged(userId: $userId) {
      userId
      isOnline
      lastSeen
    }
  }
`
