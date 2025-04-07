import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://backend-l9gz.onrender.com/graphql",
  credentials: "include", // Crucial for sending cookies cross-domain
});

// Add request headers context link
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Ensure content-type is always set
      "Content-Type": "application/json",
      // Add any other headers your backend might need
      "X-Requested-With": "XMLHttpRequest",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network", // Better for session-based apps
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only", // Ensures fresh session data
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
  // Enable sending cookies with every request
  credentials: "include",
});

export default client;