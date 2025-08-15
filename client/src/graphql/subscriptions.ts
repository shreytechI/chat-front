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

export const USER_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription UserStatusChanged($userId: ID) {
    userStatusChanged(userId: $userId) {
      userId
      isOnline
      lastSeen
    }
  }
`
