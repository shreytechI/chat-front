import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        username
        email
        profileImage
        isOnline
        lastSeen
        createdAt
        role
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        profileImage
        isOnline
        lastSeen
        createdAt
      }
    }
  }
`;

export const SET_USER_ONLINE_MUTATION = gql`
  mutation SetUserOnline($isOnline: Boolean!) {
    setUserOnline(isOnline: $isOnline) {
      userId
      isOnline
      lastSeen
    }
  }
`;

export const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom($participantIds: [ID!]!, $isGroup: Boolean, $name: String) {
    createRoom(participantIds: $participantIds, isGroup: $isGroup, name: $name) {
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
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
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
