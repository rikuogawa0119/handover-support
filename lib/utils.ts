export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`;
  return name.slice(0, 2);
}
