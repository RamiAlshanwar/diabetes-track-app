import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import jwt from "jsonwebtoken";
import connectDB from "./config/db";
import typeDefs from "./schema/typeDefs";
import resolvers from "./schema/resolvers";

dotenv.config();

const startServer = async () => {
  connectDB();

  const app = express();
  const PORT = process.env.PORT || 5000;
  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Not allowed by CORS"));
      },
    }),
  );
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
        let userId: string | null = null;

        try {
          if (token) {
            const cleanToken = token.replace("Bearer ", "");

            const decoded = jwt.verify(
              cleanToken,
              process.env.JWT_SECRET as string,
            ) as { userId: string };

            userId = decoded.userId;
          }
        } catch (error) {
          userId = null;
        }

        return { token, userId };
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
