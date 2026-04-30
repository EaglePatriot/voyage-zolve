import { transactions, user } from "@/lib/world";

export async function GET() {
  const byCategory = transactions.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
    return acc;
  }, {});

  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return Response.json({
    user: {
      name: user.name,
      country: user.country,
      visa: user.visa,
      school: user.school,
      daysInUS: user.daysInUS,
      stage: user.stage,
      creditScore: user.creditScore,
      creditScoreSeries: user.creditScoreSeries,
    },
    transactions,
    summary: {
      totalSpent,
      byCategory,
    },
  });
}
