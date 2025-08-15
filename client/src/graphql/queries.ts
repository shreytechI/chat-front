import { gql } from "@apollo/client"

// Auth Queries
export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      isOnline
      lastSeen
      createdAt
    }
  }
`