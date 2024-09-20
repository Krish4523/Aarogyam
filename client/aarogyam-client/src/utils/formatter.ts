export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN").format(date);
}

export function formatTime(time: string): string {
  // Create a Date object with the given time
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));

  // Format the time using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Set to true for 12-hour format, false for 24-hour format
  }).format(date);
}
