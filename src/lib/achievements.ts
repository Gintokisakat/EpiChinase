export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ALL_ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_review", title: "First Review", description: "Review your first card", icon: "🎯" },
  { id: "steady_learner", title: "Steady Learner", description: "Review 10 cards total", icon: "📚" },
  { id: "dedicated_scholar", title: "Dedicated Scholar", description: "Review 100 cards total", icon: "🧠" },
  { id: "streak_starter", title: "Streak Starter", description: "3-day study streak", icon: "🔥" },
  { id: "streak_master", title: "Streak Master", description: "7-day study streak", icon: "⚡" },
  { id: "streak_legend", title: "Streak Legend", description: "30-day study streak", icon: "🌟" },
  { id: "first_steps", title: "First Steps", description: "Reach level 2", icon: "🥚" },
  { id: "rising_star", title: "Rising Star", description: "Reach level 5", icon: "🐉" },
  { id: "dragon_master", title: "Dragon Master", description: "Reach level 10", icon: "👑" },
  { id: "practice_makes_perfect", title: "Practice Makes Perfect", description: "Complete 10 practice sessions", icon: "🎮" },
  { id: "speed_demon", title: "Speed Demon", description: "Play Turbo mode once", icon: "⚡" },
  { id: "bubble_popper", title: "Bubble Popper", description: "Play Pop mode once", icon: "🫧" },
  { id: "devoted", title: "Devoted", description: "Study 7 days in a row", icon: "❤️" },
];
