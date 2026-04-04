import { createContext } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  authProvider: string;
};

export type AuthContextType = {
  token: string | null;
  user: User | null;
  setAuthData: (token: string, user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);