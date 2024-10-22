"use client";

import React, { useCallback, useState } from "react";
import { Input } from "../Input";
import roadmapState from "@/lib/state";
import AuthModal from "./AuthModal";
// import axios from "axios";
// import toast from "react-hot-toast";

export const RegisterModal = () => {
  const { onModalClose, authType, onModalOpen, isModalOpen, setAuthType } =
    roadmapState(); // Extract Zustand state and actions
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = () => {
    setAuthType("login"); // Set the auth type to "login"
    onModalOpen(); // Open the modal
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
    <div className="text-primary text-center mt-4">
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
  );

  return authType === "register" ? (
    <AuthModal
      disabled={isLoading}
      isOpen={isModalOpen}
      authType={authType}
      title="Create an Account"
      actionLabel="Sign Up"
      onClose={onModalClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
      setAuthType={setAuthType}
    />
  ) : null;
};
