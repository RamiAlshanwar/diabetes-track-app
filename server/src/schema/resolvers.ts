import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";

const resolvers = {
  Query: {
    currentUser: async (
      _: unknown,
      __: unknown,
      context: { token: string },
    ) => {
      try {
        if (!context.token) return null;

        // remove "Bearer "
        const cleanToken = context.token.replace("Bearer ", "");

        // verify token
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET as string) as {
          userId: string;
        };

        // find user
        const user = await User.findById(decoded.userId);

        return user;
      } catch (error) {
        return null;
      }
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      args: { username: string; email: string; password: string },
    ) => {
      const { username, email, password } = args;

      //  check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      //  hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      //  save user
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      await user.save();

      //  generate token
      const token = generateToken(user._id.toString());

      return {
        token,
        user,
      };
    },

    login: async (_: unknown, args: { email: string; password: string }) => {
      const { email, password } = args;

      //  find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      //  compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      //  generate token
      const token = generateToken(user._id.toString());

      return {
        token,
        user,
      };
    },

    logout: () => {
      return "Logged out successfully";
    },
  },
};

export default resolvers;
