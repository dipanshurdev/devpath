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
              ${secondary ? "bg-primary" : "bg-secondary"}
              ${secondary ? "text-slate-800" : "text-primary"}
              ${secondary ? "border-slate-800" : "border-blue-300"}
              ${large ? "text-xl" : "text-base"}
              ${large ? "px-5" : "px-4"}
              ${large ? "py-3" : "px-2"}
              ${outline ? "bg-transparent" : ""}
              ${outline ? "border-blue-50" : ""}
              ${outline ? "text-primary" : ""}
              `}
    >
      {label}
    </button>
  );
};
