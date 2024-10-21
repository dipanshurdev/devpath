import React from "react";

interface InputProps {
  placeholder?: string;
  value?: string;
  type?: string;
  outline?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  onChange,
  disabled,
  placeholder,
  type,
  outline,
  value,
}) => {
  return (
    <input
      disabled={disabled}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      type={type}
      className={`
            w-full
            px-2 py-1 text-base bg-slate-800 border-2 border-slate-800  rounded-lg outline-none text-primary disabled:bg-main disabled:opacity-70 disabled:cursor-not-allowed 
            ${outline ? "focus:outline-blue-300 focus:outline" : "outline-none"}
             `}
    />
  );
};
