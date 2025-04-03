// formatDate.ts
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Extract parts of the date
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "short" }); // Get the short month name (e.g., Apr)
  const day = String(date.getDate()).padStart(2, "0");

  // Format as "Apr 10, 2025"
  return `${month} ${day}, ${year}`;
}
