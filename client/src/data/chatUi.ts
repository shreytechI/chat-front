import { ChatData } from "@/types/chat"

export const onlineUsers = [
  {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Patrick Hendricks",
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Mark Messer",
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Doris Brown",
  },
  {
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Albert Rodarte",
  },
  {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Steve Walker",
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Mirta George",
  },
]

export const chats: ChatData[] = [
  {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Patrick Hendricks",
    isOwn: false,
    chat: [
      { id: "m1", text: "Hey! How are you doing today?", dateTime: "2025-01-26T09:00:00Z" },
      { id: "m2", text: "I wanted to discuss the new project requirements", dateTime: "2025-01-26T09:02:00Z" },
      { id: "m3", text: "Can we schedule a meeting for tomorrow?", dateTime: "2025-01-26T09:05:00Z" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Mark Messer",
    isOwn: false,
    chat: [
      { id: "m4", text: "Good morning! 🌅", dateTime: "2025-01-26T08:30:00Z" },
      {
        id: "m5",
        file: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
            name: "project-mockup.jpg",
            size: "2.3 MB",
          },
        ],
        text: "Check out this design mockup",
        dateTime: "2025-01-26T08:35:00Z",
      },
      { id: "m6", text: "What do you think about the color scheme?", dateTime: "2025-01-26T08:40:00Z" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1529626465619-b24d42a4b494?w=150&h=150&fit=crop&crop=face",
    name: "Doris Brown",
    isOwn: false,
    chat: [
      { id: "m7", text: "Hi there! 👋", dateTime: "2025-01-26T10:00:00Z" },
      { id: "m8", text: "I've reviewed the documents you sent", dateTime: "2025-01-26T10:05:00Z" },
      {
        id: "m9",
        file: [
          {
            type: "document",
            url: "#",
            name: "feedback-report.pdf",
            size: "1.8 MB",
          },
        ],
        text: "Here's my detailed feedback",
        dateTime: "2025-01-26T10:10:00Z",
      },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Albert Rodarte",
    isOwn: false,
    chat: [
      { id: "m10", text: "Working on the new features 💻", dateTime: "2025-01-26T11:00:00Z" },
      { id: "m11", text: "Should be ready by end of week", dateTime: "2025-01-26T11:05:00Z" },
      {
        id: "m12",
        file: [
          {
            type: "document",
            url: "#",
            name: "development-progress.zip",
            size: "15.2 MB",
          },
        ],
        dateTime: "2025-01-26T11:10:00Z",
      },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Steve Walker",
    isOwn: false,
    chat: [
      { id: "m13", text: "Great job on the presentation! 🎉", dateTime: "2025-01-26T14:00:00Z" },
      { id: "m14", text: "The client was really impressed", dateTime: "2025-01-26T14:02:00Z" },
      { id: "m15", text: "Let's celebrate this weekend! 🍾", dateTime: "2025-01-26T14:05:00Z" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Mirta George",
    isOwn: false,
    chat: [
      { id: "m16", text: "Thanks for your help yesterday! 🙏", dateTime: "2025-01-26T16:00:00Z" },
      { id: "m17", text: "The issue is now resolved", dateTime: "2025-01-26T16:05:00Z" },
      {
        id: "m18",
        file: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
            name: "solution-screenshot.png",
            size: "890 KB",
          },
        ],
        text: "Here's the final result",
        dateTime: "2025-01-26T16:10:00Z",
      },
    ],
  },
]