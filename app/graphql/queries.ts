// graphql/queries.ts
import { gql } from "@apollo/client";

export const GET_MY_TASKS = gql`
  query MyTasks {
    myTasks {
      id
      title
      description
      status
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