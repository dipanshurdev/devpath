"use client";

import React, { useCallback, useState } from "react";
import { Input } from "../Input";
import roadmapState from "@/lib/state";
import AuthModal from "./AuthModal";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

export const RegisterModal = () => {
  const { onModalClose, authType, onModalOpen, isModalOpen, setAuthType } =
    roadmapState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  // const router = useRouter();
  const { isLoading, setIsLoading, register } = useUserContext();

  const handleLoginClick = useCallback(() => {
    setAuthType("login");
    onModalOpen();
  }, [onModalOpen, setAuthType]);

  const handleSubmit = async () => {
    // Basic email validation (regex for email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid Email Address.");
      setIsLoading(false);
      return;
    }

    try {
      const registerdUser = await register(email, password, name, username);

      if (!registerdUser) {
        toast.error("Ohh No! Something went wrong. Please try again.");
        throw new Error("Sign up failed. Please try again.");
      }
      toast.success("Welcome! You are signed up successfully.🐱");
      // console.log(newUser, session);
    } catch (error) {
      console.log(error);
    }

    // console.log({ email, password, name, username });
  };

  // Modal Body
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}
        type={"text"}
        outline={true}
      />
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading}
        outline={true}
      />
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}
        type={"email"}
        outline={true}
      />
      <Input
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
        type={"password"}
        outline={true}
      />
    </div>
  );

  // Modal Footer
  const footerContent = (
    <>
      {isLoading ? (
        <div className="w-full items-center flex justify-center flex-row text-center">
          <span className="text-primaryBlue font-semibold">
            Creating Account...
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-10">
          {/* <button onClick={handleSubmit}>Sign Up</button> */}

          <Button variant="default" size="lg" onClick={handleSubmit}>
            Sign Up
          </Button>
          <p className="w-full text-center">
            First time here? then
            <span
              onClick={handleLoginClick}
              className=" cursor-pointer hover:underline text-primaryBlue"
            >
              {" "}
              Log In
            </span>
          </p>
        </div>
      )}
    </>
  );

  return authType === "register" && isModalOpen ? (
    <AuthModal
      disabled={isLoading}
      isOpen={isModalOpen}
      authType={authType}
      title="Create an Account"
      onClose={onModalClose}
      body={bodyContent}
      footer={footerContent}
      setAuthType={setAuthType}
    />
  ) : null;
};
