const TONE_MAP: Record<string, string> = {
  ā: "a1", á: "a2", ǎ: "a3", à: "a4",
  ē: "e1", é: "e2", ě: "e3", è: "e4",
  ī: "i1", í: "i2", ǐ: "i3", ì: "i4",
  ō: "o1", ó: "o2", ǒ: "o3", ò: "o4",
  ū: "u1", ú: "u2", ǔ: "u3", ù: "u4",
  ǖ: "v1", ǘ: "v2", ǚ: "v3", ǜ: "v4",
  Ā: "A1", Á: "A2", Ǎ: "A3", À: "A4",
  Ē: "E1", É: "E2", Ě: "E3", È: "E4",
  Ī: "I1", Í: "I2", Ǐ: "I3", Ì: "I4",
  Ō: "O1", Ó: "O2", Ǒ: "O3", Ò: "O4",
  Ū: "U1", Ú: "U2", Ǔ: "U3", Ù: "U4",
};

const REVERSE_TONE_MAP: Record<string, string> = {};
for (const [marked, numbered] of Object.entries(TONE_MAP)) {
  REVERSE_TONE_MAP[numbered] = marked;
}

const VOWELS = new Set(["a", "e", "i", "o", "u", "ü", "A", "E", "I", "O", "U"]);

function isLetter(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c >= 192;
}

function splitSyllables(text: string): string[] {
  const parts: string[] = [];
  let cur = "";
  let inLetter = false;
  for (const ch of text) {
    const l = isLetter(ch);
    if (l !== inLetter && cur) {
      parts.push(cur);
      cur = "";
    }
    cur += ch;
    inLetter = l;
  }
  if (cur) parts.push(cur);
  return parts;
}

export function pinyinToNumbers(text: string): string {
  return splitSyllables(text)
    .map((part) => {
      if (!/[a-zA-ZüÜ]/.test(part)) return part;
      let tone = 5;
      let base = "";
      for (const ch of part) {
        const mapped = TONE_MAP[ch];
        if (mapped) {
          base += mapped[0];
          tone = parseInt(mapped[1]);
        } else {
          base += ch;
        }
      }
      return tone === 5 || tone === 0 ? base : base + tone;
    })
    .join("");
}

function addToneToSyllable(syllable: string, tone: number): string {
  if (tone < 1 || tone > 4) return syllable;
  const lower = syllable.toLowerCase();
  const hasA = lower.includes("a");
  const hasE = lower.includes("e");
  const hasOu = lower.includes("ou");

  let target = "";
  if (hasA) target = "a";
  else if (hasE) target = "e";
  else if (hasOu) target = "o";
  else {
    const vowels = lower.split("").filter((ch) => VOWELS.has(ch));
    if (vowels.length >= 2) target = vowels[1];
    else if (vowels.length === 1) target = vowels[0];
    else return syllable;
  }

  const idx = syllable.toLowerCase().indexOf(target);
  if (idx === -1) return syllable;
  const original = syllable[idx];
  const combined = REVERSE_TONE_MAP[original + tone] || REVERSE_TONE_MAP[original.toLowerCase() + tone];
  if (!combined) return syllable;
  return syllable.slice(0, idx) + combined + syllable.slice(idx + 1);
}

export function numbersToTones(text: string): string {
  return text.replace(/([a-zA-ZüÜ]+)([1-5])/g, (_, syl, tone) => {
    return addToneToSyllable(syl as string, parseInt(tone as string));
  });
}

export function normalizePinyin(text: string): string {
  return pinyinToNumbers(text)
    .replace(/[1-5]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function convertPinyin(text: string, mode: string): string {
  if (mode === "numbers") return pinyinToNumbers(text);
  return text;
}

export function arePinyinEqual(a: string, b: string): boolean {
  return normalizePinyin(a) === normalizePinyin(b);
}
