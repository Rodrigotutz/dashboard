export function getFirstTwoNames(fullName?: string): string {
  if (!fullName) return "";

  const names = fullName.split(" ");
  return names.slice(0, 2).join(" ");
}
