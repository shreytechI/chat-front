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