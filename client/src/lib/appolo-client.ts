import { ApolloClient, InMemoryCache, createHttpLink, split } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { getMainDefinition } from "@apollo/client/utilities"
import { createClient } from "graphql-ws"
import { getAuthToken } from "./auth" 
// HTTP Link for queries and mutations
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || "http://localhost:4000/graphql",
})

// WebSocket Link for subscriptions
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || "ws://localhost:4000/graphql",
          connectionParams: () => {
            const token = getAuthToken() 
            return {
              authorization: token ? `Bearer ${token}` : "",
            }
          },
        }),
      )
    : null

// Auth Link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== "undefined" ? getAuthToken() : null 

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// Split link to route queries/mutations to HTTP and subscriptions to WebSocket
const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return definition.kind === "OperationDefinition" && definition.operation === "subscription"
        },
        wsLink,
        authLink.concat(httpLink),
      )
    : authLink.concat(httpLink)

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          messages: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming]
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
  },
})
