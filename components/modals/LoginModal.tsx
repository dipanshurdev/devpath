"use client";

import roadmapState from "@/lib/state";
import React, { useCallback, useState } from "react";
import { Input } from "../Input";
import AuthModal from "./AuthModal";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
// import Loader from "../Loader";

export const LoginModal = () => {
  const { isModalOpen, onModalClose, onModalOpen, authType, setAuthType } =
    roadmapState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, setIsLoading, login, register } = useUserContext();

  // Handle switch to the register modal
  const handleRegisterClick = useCallback(() => {
    setAuthType("register"); // Set the auth type to "register"
    onModalOpen(); // Ensure the modal is open
  }, [onModalOpen, setAuthType]);

  // Handle form submission for login
  const onSubmit = useCallback(async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Sir, Please enter a valid email address🐱.");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      toast.success("Welcome back! You are logged in successfully.🐱");
    } catch (error) {
      console.error("Login error:", error);
    }
  }, [email, password]);

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
        <div className="w-full items-center flex justify-center flex-row text-center">
          <span className="text-primaryBlue font-semibold">
            Logging you in...
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-10">
          <Button variant="default" size="lg" onClick={onSubmit}>
            Log in
          </Button>
          <p className="w-full text-center ">
            Already have an account?
            <span
              onClick={handleRegisterClick}
              className=" cursor-pointer hover:underline text-primaryBlue"
            >
              {" "}
              Sign Up
            </span>
          </p>
        </div>
      )}
    </>
  );

  return authType === "login" && isModalOpen ? (
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
  ) : null;
};
