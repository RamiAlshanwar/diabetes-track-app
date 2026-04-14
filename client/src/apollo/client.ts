import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const graphqlUrl =
  import.meta.env.VITE_GRAPHQL_URL || "http://localhost:5000/graphql";

const httpLink = createHttpLink({
  uri: graphqlUrl,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
