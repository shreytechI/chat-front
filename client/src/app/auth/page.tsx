"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/chat");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-violet-100">
          <AuthHeader mode={mode} />
          <AuthForm mode={mode} onToggleMode={toggleMode} />
        </div>

        <div className="absolute top-10 left-10 w-20 h-20 bg-violet-100 rounded-full blur-xl opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-violet-100 rounded-full blur-xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-violet-100 rounded-full blur-xl opacity-50"></div>
      </div>
    </div>
  );
}
