"use client";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
// import { Button } from "../Button";
// import roadmapState from "@/lib/state";
// import { INewUser } from "@/types";

interface ModalProps {
  isOpen?: boolean;
  authType: string;
  setAuthType: (type: "login" | "register") => void;
  onClose: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  // actionLabel: string;
  disabled?: boolean;
  // onSubmit: (user: INewUser) => void;
}

const AuthModal: React.FC<ModalProps> = ({
  // actionLabel,
  onClose,
  body,
  disabled,
  footer,
  isOpen,
  title,
  // onSubmit,
}) => {
  // const { isModalOpen, onModalClose } = roadmapState();

  if (!isOpen) {
    return false;
  }

  const handleSubmit = () => {
    if (disabled) {
      return;
    }
    console.log("Submitting function...");

    // onSubmit();
  };

  return (
    <div className="justify-center items-center  flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-slate-800 bg-opacity-80">
      <div
        className="
        relative bg-primaryDark w-full lg:w-[35%] my-6 mx-auto lg:max-w-3xl h-full lg:h-auto rounded-lg
        "
      >
        {/* Content */}
        <div
          className="
h-full lg:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-main outline-none focus:outline-none
"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-10 rounded-t">
            <h3 className="text-3xl font-semibold text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="
            p-1 ml-auto border-0 text-primary hover:opacity-70 transition"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
          {/* Body */}
          <div
            className="
          relative p-10 flex-auto
          "
          >
            {body}
          </div>
          {/* Footer */}
          <div className="flex flex-col gap-2 p-10">
            <div className="text-primary text-center mt-4">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
