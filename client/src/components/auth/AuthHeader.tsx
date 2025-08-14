interface AuthHeaderProps {
  mode: "login" | "signup";
}

export function AuthHeader({ mode }: AuthHeaderProps) {
  const isSignup = mode === "signup";

  return (
    <div className="text-center mb-8">
      <div className="mb-4">
        <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{isSignup ? "Join the Chat" : "Welcome Back"}</h1>

      <p className="text-gray-600 text-lg">{isSignup ? "Create your account to start chatting" : "Sign in to continue your conversations"}</p>
    </div>
  );
}
