// graphql/queries.ts
import { gql } from "@apollo/client";

export const GET_MY_TASKS = gql`
  query MyTasks {
    myTasks {
      id
      title
      description
      status
      user {
        id
        name
        email
      }
    }
  }
`;

// Add to queries.ts
export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;