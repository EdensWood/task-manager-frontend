/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { API_BASE_URL } from "./config";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: `${API_BASE_URL}/graphql`,
  credentials: "include",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: ${message}`);
    });
  }
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});

export default client;