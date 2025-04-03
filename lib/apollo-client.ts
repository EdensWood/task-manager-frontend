// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { API_BASE_URL } from './config';

const httpLink = createHttpLink({
  uri: `${API_BASE_URL}/graphql`,
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'X-Requested-With': 'XMLHttpRequest' // Helps with CSRF protection
    }
  };
});

const errorLink = onError(({ networkError }) => {
  if (networkError?.message.includes('401')) {
    // Handle unauthorized errors
    window.location.href = '/sign-in';
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }
});