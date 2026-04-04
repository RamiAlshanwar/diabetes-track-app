import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import connectDB from "./config/db";
import typeDefs from "./schema/typeDefs";
import resolvers from "./schema/resolvers";

dotenv.config();

const startServer = async () => {
  connectDB();

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        const token = req.headers.authorization || "";

        return { token };
      },
    }),
  );

  app.get("/", (_req, res) => {
    res.send("Diabetes Tracker API is running...");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
};

startServer();
