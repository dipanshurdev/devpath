"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";
import { toast } from "react-toastify";
import roadmapState from "@/lib/state";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  setIsLoading: () => {},
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isModalOpen, onModalOpen, onModalClose } = roadmapState();

  const checkAuthUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();

      if (!currentAccount) {
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        return false;
      }

      const userData: IUser = {
        id: currentAccount.$id,
        name: currentAccount.name || "Unknown",
        username: currentAccount.username || "anonymous",
        email: currentAccount.email || "",
        imageUrl: currentAccount.imageUrl || "",
        bio: currentAccount.bio || "",
      };

      // if (currentAccount) {
      //   const userData = {
      //     id: currentAccount.$id,
      //     name: currentAccount.name,
      //     username: currentAccount.username,
      //     email: currentAccount.email,
      //     imageUrl: currentAccount.imageUrl,
      //     bio: currentAccount.bio,
      //   };

      setUser(userData);
      setIsAuthenticated(true);
      onModalClose();

      return true;
    } catch (error) {
      console.error(`Account not found, Error: ${error}`);
      setIsAuthenticated(false);
      setUser(INITIAL_USER);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      toast.error("You don't have an Account");
      // onModalOpen();
      setIsAuthenticated(false);
    } else {
      checkAuthUser();
    }
  }, [checkAuthUser]);

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
