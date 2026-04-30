import worldData from "@/data/world.json";

export type User = {
  id: string;
  name: string;
  initials: string;
  country: string;
  school: string;
  program: string;
  visa: string;
  arrivalDate: string;
  daysInUS: number;
  stage: string;
  stageNumber: number;
  totalStages: number;
  stageProgress: number;
  nextStage: string;
  nextStageEta: string;
  creditScore: number;
  creditScoreStart: number;
  creditScoreSeries: Array<{ date: string; score: number }>;
  creditLimit: number;
  currentBalance: number;
  currentUtilization: number;
  savingsRate: number;
  onTimePayments: number;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: string;
  merchant: string;
};

export type CohortMember = {
  id: string;
  initials: string;
  country: string;
  avg_monthly_spend: number;
  savings_rate: number;
  credit_utilization: number;
  on_time_payments_pct: number;
  current_credit_score: number;
};

export type ActiveChallenge = {
  title: string;
  deadline: string;
  joined: number;
  total: number;
  pooled: number;
  goal: number;
  userSaved: number;
  userGoal: number;
};

export type Cohort = {
  name: string;
  subtitle: string;
  size: number;
  countryBreakdown: Record<string, string>;
  members: CohortMember[];
  userPercentiles: {
    creditUtil: number;
    savingsRate: number;
    onTimePayments: number;
    creditScore: number;
  };
  activeChallenge: ActiveChallenge;
};

export type Quest = {
  id: string;
  title: string;
  xp: number;
  progress?: number;
  deadline?: string;
  category?: string;
  completedOn?: string;
};

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  earned: boolean;
};

export type World = {
  generatedAt: string;
  user: User;
  transactions: Transaction[];
  cohort: Cohort;
  quests: {
    totalXP: number;
    level: number;
    levelName: string;
    nextLevelAt: number;
    nextLevelName: string;
    active: Quest[];
    completed: Quest[];
    badges: Badge[];
  };
};

export const world = worldData as World;
export const user = world.user;
export const transactions = world.transactions;
export const cohort = world.cohort;
export const quests = world.quests;

export function getRecentTransactions(n: number = 10): Transaction[] {
  return [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, n);
}

export function getDiningSpike(): {
  recentTotal: number;
  weeklyAvg: number;
  percentDelta: number;
} {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const latestDate = new Date(sorted[sorted.length - 1]?.date ?? Date.now());
  const endRecent = latestDate.getTime();
  const startRecent = endRecent - 6 * 24 * 60 * 60 * 1000;
  const startPrev28 = startRecent - 28 * 24 * 60 * 60 * 1000;

  const isDining = (tx: Transaction) => tx.category.toLowerCase() === "dining";

  const recentTotal = sorted
    .filter((tx) => {
      const time = new Date(tx.date).getTime();
      return isDining(tx) && time >= startRecent && time <= endRecent;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const previousDining = sorted.filter((tx) => {
    const time = new Date(tx.date).getTime();
    return isDining(tx) && time >= startPrev28 && time < startRecent;
  });

  const weekSums = [0, 0, 0, 0];
  for (const tx of previousDining) {
    const diffDays = Math.floor(
      (new Date(tx.date).getTime() - startPrev28) / (24 * 60 * 60 * 1000),
    );
    const weekIndex = Math.min(3, Math.max(0, Math.floor(diffDays / 7)));
    weekSums[weekIndex] += tx.amount;
  }

  const weeklyAvg = weekSums.reduce((sum, value) => sum + value, 0) / 4;
  const rawDelta =
    weeklyAvg === 0 ? 0 : ((recentTotal - weeklyAvg) / weeklyAvg) * 100;
  const percentDelta = Math.round(rawDelta * 10) / 10;

  return { recentTotal, weeklyAvg, percentDelta };
}

export function getCategoryTotals(): Record<string, number> {
  return transactions.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
    return acc;
  }, {});
}
