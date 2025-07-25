export default function FormatTimestamp(timestamp) {
  if (!timestamp) return "";

  const messageDate = timestamp.toDate();
  const now = new Date();

  const isToday =
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear();

  if (isToday) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
    const day = messageDate.getDate().toString().padStart(2, "0");
    const year = messageDate.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }
}
