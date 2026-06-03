export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  source: "youtube" | "audio";
  url: string;
  image: string;
}

export const PODCASTS: PodcastEpisode[] = [
  {
    id: "slow-chinese-1",
    title: "慢速中文 | Una historia de amor en la蒙自",
    description: "Historia de amor contada en chino lento, ideal para estudiantes de nivel intermedio.",
    level: "HSK 3-4",
    duration: "8:24",
    source: "youtube",
    url: "https://www.youtube.com/embed/6Z5EwaBpw0g",
    image: "🎧",
  },
  {
    id: "tea-break-1",
    title: "茶歇中文 | Viajar en tren por China",
    description: "Conversación sobre viajes en tren bala, vocabulario útil para viajeros.",
    level: "HSK 4-5",
    duration: "12:30",
    source: "youtube",
    url: "https://www.youtube.com/embed/cHV6_BjO9Vk",
    image: "🍵",
  },
  {
    id: "stories-1",
    title: "Learning Chinese Through Stories | El conejito blanco",
    description: "Cuento tradicional chino narrado lentamente con pinyin en pantalla.",
    level: "HSK 2-3",
    duration: "6:45",
    source: "youtube",
    url: "https://www.youtube.com/embed/1cBmYdhmVI0",
    image: "📖",
  },
  {
    id: "chinesepod-1",
    title: "ChinesePod | Pedir comida en un restaurante",
    description: "Lección de diálogo situacional para pedir comida en chino.",
    level: "HSK 1-2",
    duration: "10:15",
    source: "youtube",
    url: "https://www.youtube.com/embed/4L3IDF5Fkm0",
    image: "🥟",
  },
  {
    id: "slow-chinese-2",
    title: "慢速中文 | Costumbres del Año Nuevo Chino",
    description: "Exploración de las tradiciones del Spring Festival en China.",
    level: "HSK 3-4",
    duration: "9:30",
    source: "youtube",
    url: "https://www.youtube.com/embed/A8R3zHx_1bI",
    image: "🧧",
  },
  {
    id: "maomi-1",
    title: "猫腻 | Poemas chinos clásicos",
    description: "Recitación y explicación de poemas de la dinastía Tang.",
    level: "HSK 5-6",
    duration: "15:00",
    source: "youtube",
    url: "https://www.youtube.com/embed/L3XYh0Kj0MU",
    image: "📜",
  },
];

export function getLevelColor(level: string): string {
  const num = parseInt(level.replace(/\D/g, "")) || 3;
  if (num <= 2) return "bg-jade-500";
  if (num <= 4) return "bg-gold-500";
  return "bg-red-400";
}
