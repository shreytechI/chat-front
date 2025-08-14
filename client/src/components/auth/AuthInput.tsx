"use client";

interface AuthInputProps {
  type: "text" | "email" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function AuthInput({ type, placeholder, value, onChange, error }: AuthInputProps) {
  return (
    <div className="space-y-1">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
          error ? "border-red-500 focus:ring-red-200 focus:border-red-500" : "border-gray-300 focus:ring-violet-200 focus:border-violet-500"
        }`}
      />
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
}
