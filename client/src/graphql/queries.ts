import { gql } from "@apollo/client";

// Auth Queries
export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      profileImage
      isOnline
      lastSeen
      createdAt
    }
  }
`;

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      username
      email
      profileImage
      isOnline
      lastSeen
      createdAt
    }
  }
`;

// Chat Queries
export const ROOMS_QUERY = gql`
  query Rooms {
    rooms {
      id
      participants {
        id
        username
        email
        isOnline
        lastSeen
      }
      isGroup
      name
      createdAt
    }
  }
`;

export const MESSAGES_QUERY = gql`
  query Messages($roomId: ID!, $limit: Int, $before: String) {
    messages(roomId: $roomId, limit: $limit, before: $before) {
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
`;


export const FIND_OR_CREATE_ROOM_QUERY = gql`
  query FindOrCreateRoom($participantId: ID!) {
    findOrCreateRoom(participantId: $participantId) {
      id
      participants {
        id
        username
        email
        profileImage
        isOnline
        lastSeen
      }
      isGroup
      name
      createdAt
    }
  }
`