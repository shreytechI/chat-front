"use client";


import { ProtectedRoute } from "@/components/auth/Protected-route"
import ChatUi from "@/pages/ChatUi"

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div>
        <ChatUi />
      </div>
    </ProtectedRoute>
  )
}
