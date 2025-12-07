// Simple slugify util that converts to lower case, replaces spaces and invalid chars with - and  strips leading/trailing dashes 
export default function slugify(input: string | undefined): string {
  if (!input) return "";
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "") // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
