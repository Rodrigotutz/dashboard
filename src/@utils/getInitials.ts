export function getInitials(fullName?: string): string {
  if (!fullName) return "";

  const names = fullName.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");

  return initials;
}
