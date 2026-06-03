type Mood = "happy" | "studying" | "celebrating";

interface Props {
  mood?: Mood;
  width?: number;
  height?: number;
  className?: string;
  level?: number;
}

const emojiMap: Record<Mood, string> = {
  happy: "/dragnhappy.svg",
  studying: "/dragnthink.svg",
  celebrating: "/dragnaww.svg",
};

function getTier(level: number): number {
  if (level >= 9) return 5;
  if (level >= 7) return 4;
  if (level >= 5) return 3;
  if (level >= 3) return 2;
  return 1;
}

const tierFilters: Record<number, string> = {
  1: "hue-rotate(0deg) saturate(1)",
  2: "hue-rotate(20deg) saturate(1.3)",
  3: "hue-rotate(200deg) saturate(1.5) brightness(1.1)",
  4: "hue-rotate(320deg) saturate(1.5) brightness(1.2)",
  5: "hue-rotate(0deg) saturate(2) brightness(1.3)",
};

const tierSizes: Record<number, number> = {
  1: 1,
  2: 1.15,
  3: 1.3,
  4: 1.4,
  5: 1.5,
};

const tierAccessories: Record<number, string | null> = {
  1: null,
  2: null,
  3: "✨",
  4: "👑",
  5: "👑",
};

export default function Dragon({ mood = "happy", width = 200, height, className = "", level = 1 }: Props) {
  const src = emojiMap[mood];
  const tier = getTier(level);
  const scale = tierSizes[tier];
  const filter = tierFilters[tier];
  const accessory = tierAccessories[tier];
  const displayW = width * scale;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: displayW, height: height ?? displayW }}>
      {accessory && (
        <span className="absolute" style={{ top: "-8%", right: "-5%", fontSize: `${displayW * 0.22}px`, zIndex: 10 }}>
          {accessory}
        </span>
      )}
      <img
        src={src}
        alt={`Dragon ${mood}`}
        className="w-full h-full object-contain transition-all duration-500"
        style={{ filter }}
        draggable={false}
      />
      {mood === "celebrating" && (
        <>
          <span className="absolute" style={{ top: "2%", left: "0%", fontSize: `${displayW * 0.15}px` }}>⭐</span>
          <span className="absolute" style={{ top: "0%", right: "0%", fontSize: `${displayW * 0.12}px` }}>✨</span>
        </>
      )}
    </div>
  );
}
