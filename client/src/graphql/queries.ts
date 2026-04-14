import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      username
      email
      role
      authProvider
    }
  }
`;

export const GET_READINGS = gql`
  query GetReadings {
    myReadings {
      id
      value
      status
      readingTime
      note
    }
  }
`;

export const GET_READING = gql`
  query GetReading($id: ID!) {
    reading(id: $id) {
      id
      value
      status
      readingTime
      note
    }
  }
`;
