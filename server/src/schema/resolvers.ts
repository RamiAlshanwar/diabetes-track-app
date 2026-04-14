import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";
import GlucoseReading from "../models/GlucoseReading";
import {
  formatReadingTime,
  getGlucoseStatus,
  validateGlucoseValue,
} from "../utils/glucose";

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
        const decoded = jwt.verify(
          cleanToken,
          process.env.JWT_SECRET as string,
        ) as {
          userId: string;
        };

        // find user
        const user = await User.findById(decoded.userId);

        return user;
      } catch (error) {
        return null;
      }
    },

    myReadings: async (
      _: unknown,
      __: unknown,
      context: { token: string; userId: string | null },
    ) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }

      return await GlucoseReading.find({ user: context.userId })
        .populate("user")
        .sort({ readingTime: -1 });
    },

    reading: async (
      _: unknown,
      args: { id: string },
      context: { token: string; userId: string | null },
    ) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }

      const reading = await GlucoseReading.findOne({
        _id: args.id,
        user: context.userId,
      }).populate("user");

      if (!reading) {
        throw new Error("Reading not found");
      }

      return reading;
    },
  },

  GlucoseReading: {
    status: (reading: { value: number }) => {
      return getGlucoseStatus(reading.value);
    },
    readingTime: (reading: { readingTime: Date | string }) => {
      return formatReadingTime(reading.readingTime);
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

    addReading: async (
      _: unknown,
      args: { value: number; readingTime: string; note?: string },
      context: { token: string; userId: string | null },
    ) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }

      validateGlucoseValue(args.value);

      const reading = new GlucoseReading({
        value: args.value,
        readingTime: new Date(args.readingTime),
        note: args.note || "",
        user: context.userId,
      });

      await reading.save();

      return await reading.populate("user");
    },

    updateReading: async (
      _: unknown,
      args: { id: string; value: number; readingTime: string; note?: string },
      context: { token: string; userId: string | null },
    ) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }

      validateGlucoseValue(args.value);

      const reading = await GlucoseReading.findOne({
        _id: args.id,
        user: context.userId,
      });

      if (!reading) {
        throw new Error("Reading not found");
      }

      reading.value = args.value;
      reading.readingTime = new Date(args.readingTime);
      reading.note = args.note || "";

      await reading.save();

      return await reading.populate("user");
    },

    deleteReading: async (
      _: unknown,
      args: { id: string },
      context: { token: string; userId: string | null },
    ) => {
      if (!context.userId) {
        throw new Error("Unauthorized");
      }

      const reading = await GlucoseReading.findOneAndDelete({
        _id: args.id,
        user: context.userId,
      });

      if (!reading) {
        throw new Error("Reading not found");
      }

      return "Reading deleted successfully";
    },
  },
};

export default resolvers;
