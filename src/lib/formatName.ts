export function formatName(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    // Return first two letters if only one word
    return words[0].substring(0, 2).toUpperCase();
  }

  const firstInitial = words[0][0];
  const lastInitial = words[words.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
}
