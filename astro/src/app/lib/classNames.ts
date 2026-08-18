type ClassNameValue = string | false | null | undefined;

export function cn(...values: ClassNameValue[]) {
  return values
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toString().trim())
    .filter(Boolean)
    .join(" ");
}
