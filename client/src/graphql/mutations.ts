import { gql } from "@apollo/client"

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        username
        email
        isOnline
        lastSeen
        createdAt
      }
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
       token
      user {
        id
        username
        email
        isOnline
        lastSeen
        createdAt
      }
    }
  }
`

export const SET_USER_ONLINE_MUTATION = gql`
  mutation SetUserOnline($isOnline: Boolean!) {
    setUserOnline(isOnline: $isOnline) {
      userId
      isOnline
      lastSeen
    }
  }
`