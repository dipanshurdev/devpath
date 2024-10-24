"use client";

import React, { useState } from "react";
import { Input } from "../Input";
import roadmapState from "@/lib/state";
import AuthModal from "./AuthModal";
import { createAccount, signInUser } from "@/lib/appwrite/api";
import { useRouter } from "next/navigation";
import { Button } from "../Button";

export const RegisterModal = () => {
  const { onModalClose, authType, onModalOpen, isModalOpen, setAuthType } =
    roadmapState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginClick = () => {
    setAuthType("login");
    onModalOpen();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Basic email validation (regex for email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      console.error("Invalid email format");
      alert("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const newUser = await createAccount({ email, password, name, username });

      if (!newUser) {
        throw new Error("Sign up failed. Please try again.");
      }

      const session = await signInUser({
        email: email,
        password: password,
      });

      if (!session) {
        throw new Error("Sign up failed. Please try again.");
      }
      console.log(newUser, session);

      onModalClose();

      return newUser;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    console.log({ email, password, name, username });
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
        "Logging in..."
      ) : (
        <div className="flex flex-col gap-2 p-10">
          {/* <button onClick={handleSubmit}>Sign Up</button> */}

          <Button label="Sign Up" fullWidth large onClick={handleSubmit} />
          <p className="w-full">
            Already have an account? then
            <span
              onClick={handleLoginClick}
              className="text-secondary cursor-pointer hover:underline text-primaryBlue"
            >
              {" "}
              Log In
            </span>
          </p>
        </div>
      )}
    </>
  );

  return authType === "register" ? (
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
