import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { z } from "zod";

import { BUDDY_SYSTEM_PROMPT, buildUserContext } from "@/lib/prompts";
import { getDiningSpike, getRecentTransactions, user } from "@/lib/world";

export const runtime = "nodejs";

const BodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.union([z.literal("user"), z.literal("assistant")]),
      content: z.string(),
    }),
  ),
});

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const pushEvent = (payload: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
      };

      try {
        const body = BodySchema.parse(await req.json());
        const today = new Date().toISOString().split("T")[0];
        const system =
          BUDDY_SYSTEM_PROMPT +
          "\n\n" +
          buildUserContext(user, getRecentTransactions(10), getDiningSpike(), today);

        const client = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const stream = client.messages.stream({
          model: "claude-sonnet-4-5",
          max_tokens: 600,
          system,
          messages: body.messages,
        });

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            pushEvent({ type: "text", delta: event.delta.text });
          }
        }

        pushEvent({ type: "done" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        pushEvent({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
