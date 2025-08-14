"use client";

import type React from "react";

interface AuthButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export function AuthButton({ children, onClick, disabled = false, variant = "primary" }: AuthButtonProps) {
  const baseClasses = "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2";

  const variantClasses = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800 focus:ring-violet-200",
    secondary: "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-200",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
