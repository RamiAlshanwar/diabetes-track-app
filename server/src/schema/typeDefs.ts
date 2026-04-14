import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    authProvider: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type GlucoseReading {
    id: ID!
    value: Float!
    status: String!
    readingTime: String!
    note: String
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    currentUser: User
    reading(id: ID!): GlucoseReading
    myReadings: [GlucoseReading!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: String!

    addReading(value: Float!, readingTime: String!, note: String): GlucoseReading!
    updateReading(id: ID!, value: Float!, readingTime: String!, note: String): GlucoseReading!
    deleteReading(id: ID!): String!
  }
`;

export default typeDefs;
