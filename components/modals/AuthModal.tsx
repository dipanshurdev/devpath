"use client";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import Icon from "../navbar/Icon";
import { Button } from "../ui/button";

interface ModalProps {
  isOpen?: boolean;
  authType: string;
  setAuthType: (type: "login" | "register") => void;
  onClose: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  disabled?: boolean;
}

const AuthModal: React.FC<ModalProps> = ({
  onClose,
  body,
  disabled,
  footer,
  isOpen,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-darkLight/50 backdrop-blur-md outline-none focus:outline-none  bg-opacity-80">
      <div className="relative w-full max-w-md bg-primaryDark  rounded-2xl shadow-xl p-8">
        {/* Close Button */}
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          disabled={disabled}
        >
          <AiOutlineClose size={24} />
        </Button>

        {/* Logo & Title */}
        <div className="flex flex-col items-center space-y-4">
          <Icon title="DevPath" bg="bg-primaryBlue" />
          <h3 className="text-2xl font-bold text-primaryBlue dark:text-white">
            {title}
          </h3>
        </div>

        {/* Body Content */}
        <div className="mt-6">{body}</div>

        {/* Footer */}
        <div className="mt-6">{footer}</div>
      </div>
    </div>
  );
};

export default AuthModal;
