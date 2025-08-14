"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleSubmit = (data: any) => {
    console.log("Auth data:", data);
    if (mode === "signup") {
      console.log("Signup with:", data);
    } else {
      console.log("Login with:", data);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-violet-100">
          <AuthHeader mode={mode} />
          <AuthForm mode={mode} onSubmit={handleSubmit} onToggleMode={toggleMode} />
        </div>

        <div className="absolute top-10 left-10 w-20 h-20 bg-violet-100 rounded-full blur-xl opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-violet-100 rounded-full blur-xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-violet-100 rounded-full blur-xl opacity-50"></div>
      </div>
    </div>
  );
}
