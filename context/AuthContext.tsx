// "use client";

// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { IUser } from "@/types";
// import { getCurrentUser, signOutAccount } from "@/lib/appwrite/api";
// import { toast } from "react-toastify";
// import roadmapState from "@/lib/state";
// import { Models } from 'appwrite';

// export const INITIAL_USER = {
//   id: "",
//   name: "",
//   username: "",
//   email: "",
//   imageUrl: "",
//   bio: "",
// };

// const INITIAL_STATE = {
//   user: INITIAL_USER,
//   isLoading: false,
//   setIsLoading: () => {},
//   isAuthenticated: false,
//   setUser: () => {},
//   setIsAuthenticated: () => {},
//   checkAuthUser: async () => false as boolean,
//   logout: async () => false,
//   registerUser: async () => {},
//   loginUser: async () => {}
// };

// type IContextType = {
//   user: IUser;
//   isLoading: boolean;
//   setUser: React.Dispatch<React.SetStateAction<IUser>>;
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   isAuthenticated: boolean;
//   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
//   checkAuthUser: () => Promise<boolean>;
//   logout: () => Promise<void>;
//   loginUser: (email: string, password: string) => Promise<void>;
//   registerUser: (
//     email: string,
//     password: string,
//     name: string,
//     username:string
//   ) => Promise<void>;
// };

// const AuthContext = createContext<IContextType>(INITIAL_STATE);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<IUser>(INITIAL_USER);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { isModalOpen, onModalOpen, onModalClose } = roadmapState();

//   const checkAuthUser = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const currentAccount = await getCurrentUser();
//       console.log(currentAccount, isAuthenticated);

//       if (!currentAccount) {
//         setIsAuthenticated(false);
//         setUser(INITIAL_USER);
//         return false;
//       }

//       const userData: IUser = {
//         id: currentAccount.$id,
//         name: currentAccount.name || "Unknown",
//         username: currentAccount.username || "anonymous",
//         email: currentAccount.email || "",
//         imageUrl: currentAccount.imageUrl || "",
//         bio: currentAccount.bio || "",
//       };

//       setUser(userData);
//       setIsAuthenticated(true);
//       onModalClose();

//       return true;
//     } catch (error) {
//       console.error(`Account not found, Error: ${error}`);
//       setIsAuthenticated(false);
//       setUser(INITIAL_USER);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const cookieFallback = localStorage.getItem("cookieFallback");
//     if (
//       cookieFallback === "[]" ||
//       cookieFallback === null ||
//       cookieFallback === undefined
//     ) {
//       // toast.error("You don't have an Account");
//       // onModalOpen();
//       setIsAuthenticated(false);
//     } else {
//       checkAuthUser();
//     }
//   }, [checkAuthUser]);

//   const logout = async () => {
//     try {
//       await signOutAccount();
//       setUser(INITIAL_USER);
//       setIsAuthenticated(false);
//       toast.success("Logout successful! We will miss you! 😿👋");
//     } catch (error: any | undefined) {
//       throw Error("Error during logout:", error);
//     }
//   };

//   const value = {
//     user,
//     setUser,
//     isLoading,
//     setIsLoading,
//     isAuthenticated,
//     setIsAuthenticated,
//     checkAuthUser,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export const useUserContext = () => useContext(AuthContext);

//----------------------------------------------------

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "@/types";
import {
  createAccount,
  getCurrentUser,
  signInUser,
  signOutAccount,
} from "@/lib/appwrite/api";
import { toast } from "react-toastify";
import roadmapState from "@/lib/state";
import { Models } from "appwrite";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  setIsLoading: () => {},
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
  login: async () => {},
  register: async () => undefined,
  logout: async () => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    username: string
  ) => Promise<Models.Document | undefined>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { onModalClose } = roadmapState();

  // Check if the user is authenticated
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

  // Login user
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const session = await signInUser({ email, password });

      if (!session) {
        toast.error("No No you don't have an account🙀, create one!");
        throw new Error("Error session not found!");
      }
      onModalClose();
      await checkAuthUser();
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (
    email: string,
    password: string,
    name: string,
    username: string
  ): Promise<Models.Document | undefined> => {
    setIsLoading(true);
    try {
      const newUser = await createAccount({ email, password, name, username });
      if (!newUser) {
        toast.error("Ohh No! Something went wrong. Please try again.");
        throw new Error("Sign up failed. Please try again.");
      }

      const session = await signInUser({ email, password });
      if (!session) {
        toast.error("Failed to auto-login after registration.");
      }
      onModalClose();
      // await checkAuthUser();
      return newUser;
    } catch (error) {
      toast.error("Something went wrong during registration.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOutAccount();
      setIsAuthenticated(false);
      setUser(INITIAL_USER);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      toast.error("You don't have an Account");
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
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
