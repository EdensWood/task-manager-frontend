import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { setContext } from "@apollo/client/link/context";
// Removed Cookies import as it's not needed for session-based auth

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL + "/graphql",
  credentials: "include", // Ensure cookies are sent with requests
});

// Removed authLink as it's not needed for session-based auth

const client = new ApolloClient({
  link: httpLink, // Directly use httpLink
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export default client;