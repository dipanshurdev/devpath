"use client";

import roadmapState from "@/lib/state";
import React, { useCallback, useState } from "react";
import { Input } from "../Input";
import AuthModal from "./AuthModal";

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
    try {
      setIsLoading(true);

      // Example: Perform authentication logic here
      // await signIn("credentials", { email, password });

      console.log("Logging in with:", email, password);

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
    <div className="text-primary text-center mt-4">
      <p className="">
        First time here? Go to the
        <span
          onClick={handleRegisterClick} // Switch to the Sign-Up modal
          className="text-secondary cursor-pointer hover:underline text-primaryBlue"
        >
          {" "}
          Sign Up
        </span>{" "}
        page.
      </p>
    </div>
  );

  // Conditionally render based on authType but still return a consistent structure
  return authType === "login" ? (
    <AuthModal
      disabled={isLoading}
      isOpen={isModalOpen}
      authType={authType}
      setAuthType={setAuthType}
      title="Login to your account"
      actionLabel="Sign In"
      onClose={onModalClose}
      onSubmit={onSubmit} // Handle form submission
      body={bodyContent}
      footer={footerContent}
    />
  ) : null; // Return null if it's not a login modal, but the hook order stays consistent
};
