import { Converter } from "opencc-js";

let converter: ((text: string) => string) | null = null;

function toTraditional(text: string): string {
  if (!converter) {
    converter = Converter({ from: "cn", to: "tw" });
  }
  return converter(text);
}

export function convertChinese<T>(obj: T, mode: string): T {
  if (mode !== "traditional") return obj;
  if (typeof obj === "string") return toTraditional(obj) as T;
  if (Array.isArray(obj)) return obj.map((item) => convertChinese(item, mode)) as T;
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = key === "chinese" || key === "hanzi" ? convertChinese(val, mode) : val;
    }
    return result as T;
  }
  return obj;
}
