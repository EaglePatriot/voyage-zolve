import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import { buildUserContext, INSIGHT_SYSTEM_PROMPT } from "@/lib/prompts";
import { getDiningSpike, getRecentTransactions, user } from "@/lib/world";

export const runtime = "nodejs";

const BodySchema = z.object({
  scope: z
    .union([
      z.literal("daily_nudge"),
      z.literal("weekly_summary"),
      z.literal("stage_milestone"),
    ])
    .optional(),
});

const InsightSchema = z.object({
  headline: z.string().max(80),
  body: z.string().max(200),
  cta: z.object({ label: z.string(), action: z.string() }).nullable(),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

const InvalidJsonRetryPrompt =
  "Your previous reply wasn't valid JSON. Output ONLY a JSON object matching the schema.";

function getTextContent(content: Anthropic.Messages.Message["content"]): string {
  const first = content[0];
  if (first && first.type === "text") {
    return first.text;
  }
  throw new Error("Model response did not include a text block.");
}

export async function POST(req: Request) {
  try {
    const body = BodySchema.parse(await req.json());
    const scope = body.scope ?? "daily_nudge";

    const today = new Date().toISOString().split("T")[0];
    const userContext = buildUserContext(
      user,
      getRecentTransactions(10),
      getDiningSpike(),
      today,
    );

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const system = `${INSIGHT_SYSTEM_PROMPT}\n\n${userContext}`;
    const messages: Anthropic.Messages.MessageParam[] = [
      { role: "user", content: `Generate a ${scope} insight.` },
    ];

    const firstResponse = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      system,
      messages,
    });

    let rawText = getTextContent(firstResponse.content);
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      messages.push({ role: "assistant", content: rawText });
      messages.push({ role: "user", content: InvalidJsonRetryPrompt });

      const retryResponse = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 400,
        system,
        messages,
      });

      rawText = getTextContent(retryResponse.content);
      parsed = JSON.parse(rawText);
    }

    const validated = InsightSchema.parse(parsed);
    return Response.json(validated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
