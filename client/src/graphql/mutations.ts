import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
        authProvider
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
        authProvider
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logout
  }
`;

export const ADD_READING = gql`
  mutation AddReading($value: Float!, $readingTime: String!, $note: String) {
    addReading(value: $value, readingTime: $readingTime, note: $note) {
      id
      value
      status
      readingTime
      note
      user {
        username
      }
    }
  }
`;

export const DELETE_READING = gql`
  mutation DeleteReading($id: ID!) {
    deleteReading(id: $id)
  }
`;

export const UPDATE_READING = gql`
  mutation UpdateReading(
    $id: ID!
    $value: Float!
    $readingTime: String!
    $note: String
  ) {
    updateReading(
      id: $id
      value: $value
      readingTime: $readingTime
      note: $note
    ) {
      id
      value
      status
      readingTime
      note
    }
  }
`;
