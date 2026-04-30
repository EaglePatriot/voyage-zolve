import worldData from "@/data/world.json";

export const world = worldData;
export const user = worldData.user;
export const cohort = worldData.cohort;
export const quests = worldData.quests;
export const transactions = worldData.transactions as Array<{
  id: string;
  date: string;
  amount: number;
  category: string;
  merchant: string;
}>;