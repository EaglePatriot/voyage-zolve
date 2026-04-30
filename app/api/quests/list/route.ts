import { quests } from "@/lib/world";

export async function GET() {
  const progress = quests.totalXP / quests.nextLevelAt;

  return Response.json({
    totalXP: quests.totalXP,
    level: quests.level,
    levelName: quests.levelName,
    nextLevelAt: quests.nextLevelAt,
    nextLevelName: quests.nextLevelName,
    progress,
    active: quests.active,
    completed: quests.completed,
    badges: quests.badges,
  });
}
