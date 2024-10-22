"use client";

import React from "react";

interface ButtonProps {
  label: string;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  outline?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  fullWidth,
  large,
  disabled,
  secondary,
  outline,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
              disabled:opacity-70
              disabled:cursor-not-allowed
              rounded-full
              font-semibold
              hover:opacity-80
              transition
              border-2
              ${fullWidth ? "w-full" : "w-fit"}
              ${secondary ? "bg-primaryDark" : "bg-primaryBlue"}
              ${secondary ? "text-primaryWhite" : "text-primaryWhite"}
              ${secondary ? "border-primaryDark" : "border-primaryBlue"}
              ${large ? "text-xl" : "text-base"}
              ${large ? "px-5" : "px-4"}
              ${large ? "py-3" : "px-2"}
              ${outline ? "bg-transparent" : ""}
              ${outline ? "border-primaryWhite" : ""}
              ${outline ? "text-primary" : ""}
              `}
    >
      {label}
    </button>
  );
};
