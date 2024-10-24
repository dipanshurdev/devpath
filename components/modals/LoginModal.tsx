"use client";

import roadmapState from "@/lib/state";
import React, { useCallback, useState } from "react";
import { Input } from "../Input";
import AuthModal from "./AuthModal";
import { Button } from "../Button";
import { signInUser } from "@/lib/appwrite/api";

export const LoginModal = () => {
  const { isModalOpen, onModalClose, onModalOpen, authType, setAuthType } =
    roadmapState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle switch to the register modal
  const handleRegisterClick = () => {
    setAuthType("register"); // Set the auth type to "register"
    onModalOpen(); // Ensure the modal is open
  };

  // Handle form submission for login
  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      console.error("Invalid email format");
      alert("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    try {
      const session = await signInUser({
        email: email,
        password: password,
      });

      if (!session) {
        throw new Error("Error session not found!");
      }

      // Close the modal after login
      onModalClose();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, onModalClose]);

  // Modal body content for login
  const bodyContent = (
    <div className="flex flex-col gap-4 w-full">
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}
        type="email"
        outline={true}
      />
      <Input
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
        type="password"
        outline={true}
      />
    </div>
  );

  // Modal footer content with a link to switch to sign-up
  const footerContent = (
    <>
      {isLoading ? (
        "Creating account..."
      ) : (
        <div className="flex flex-col gap-2 p-10">
          <Button label="Sign Up" fullWidth large onClick={onSubmit} />
          <p className="w-full">
            Already have an account? then
            <span
              onClick={handleRegisterClick}
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

  // Conditionally render based on authType but still return a consistent structure
  return authType === "login" ? (
    <AuthModal
      disabled={isLoading}
      isOpen={isModalOpen}
      authType={authType}
      setAuthType={setAuthType}
      title="Login to your account"
      onClose={onModalClose}
      // onSubmit={onSubmit} // Handle form submission
      body={bodyContent}
      footer={footerContent}
    />
  ) : null; // Return null if it's not a login modal, but the hook order stays consistent
};
