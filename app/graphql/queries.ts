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