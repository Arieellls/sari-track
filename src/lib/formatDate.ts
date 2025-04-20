// formatDate.ts
export function formatDate(
  dateString: string,
  hideCurrentYear: boolean = false,
): string {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();

  // Extract parts of the date
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "short" }); // Get the short month name (e.g., Apr)
  const day = String(date.getDate()).padStart(2, "0");

  // Format conditionally
  if (hideCurrentYear && year === currentYear) {
    return `${month} ${day}`;
  }

  return `${month} ${day}, ${year}`;
}
