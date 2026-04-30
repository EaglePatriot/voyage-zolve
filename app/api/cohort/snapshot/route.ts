import { cohort } from "@/lib/world";

export async function GET() {
  return Response.json({
    cohortName: cohort.name,
    subtitle: cohort.subtitle,
    size: cohort.size,
    countryBreakdown: cohort.countryBreakdown,
    userPercentiles: cohort.userPercentiles,
    activeChallenge: cohort.activeChallenge,
  });
}
