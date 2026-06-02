type Mood = "happy" | "studying" | "celebrating";

interface Props {
  mood?: Mood;
  width?: number;
  height?: number;
  className?: string;
}

const emojiMap: Record<Mood, string> = {
  happy: "/dragnhappy.svg",
  studying: "/dragnthink.svg",
  celebrating: "/dragnaww.svg",
};

export default function Dragon({ mood = "happy", width = 200, height }: Props) {
  const src = emojiMap[mood];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width, height }}>
      <img
        src={src}
        alt={`Dragon ${mood}`}
        className="w-full h-full object-contain"
        draggable={false}
      />
      {mood === "celebrating" && (
        <>
          <span className="absolute" style={{ top: "2%", left: "0%", fontSize: `${width * 0.15}px` }}>⭐</span>
          <span className="absolute" style={{ top: "0%", right: "0%", fontSize: `${width * 0.12}px` }}>✨</span>
        </>
      )}
    </div>
  );
}
