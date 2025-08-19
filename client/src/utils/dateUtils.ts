export const formatTime = (dateValue: string | number): string => {
  const timestamp = typeof dateValue === "string" ? Number(dateValue) : dateValue;
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", dateValue);
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};



export const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return "few mins ago";

    const lastSeenDate = new Date(typeof lastSeen === "string" ? Number(lastSeen) || lastSeen : lastSeen);
    const diffMs = Date.now() - lastSeenDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    return lastSeenDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
