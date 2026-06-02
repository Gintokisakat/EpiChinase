export interface Card {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  audio_url?: string;
  tags: string[];
  deck_id: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  card_count: number;
}

export interface ReviewLog {
  card_id: string;
  rating: number;
  reviewed_at: string;
  ease: number;
  interval: number;
}
