export const generateLink = (input: string): string => {
  if (!input) return ""

  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya"
  }

  // Normalize to string
  let s = String(input)

  // Lowercase
  s = s.toLowerCase()

  // Replace cyrillic letters using the map
  s = s
    .split("")
    .map((ch) => {
      // if it's a Cyrillic char in map -> transliterate
      if (Object.prototype.hasOwnProperty.call(map, ch)) return map[ch]
      return ch
    })
    .join("")

  // Replace spaces and many common separators with hyphen
  s = s.replace(/[\s._/\\,+]+/g, "-")

  // Remove anything that is not a-z, 0-9 or hyphen
  s = s.replace(/[^a-z0-9-]/g, "")

  // Collapse multiple hyphens
  s = s.replace(/-+/g, "-")

  // Trim hyphens from ends
  s = s.replace(/^-+|-+$/g, "")

  return s
}
