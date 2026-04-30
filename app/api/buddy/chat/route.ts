import Anthropic from "@anthropic-ai/sdk";
import { BUDDY_SYSTEM_PROMPT, buildUserContext } from "@/lib/prompts";
import { user, transactions } from "@/lib/world";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as { role: "user" | "assistant"; content: string }[];

    const context = buildUserContext(
      user.name,
      user.creditScore,
      user.currentUtilization,
      transactions
    );

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system: `${BUDDY_SYSTEM_PROMPT}\n\n${context}`,
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Buddy API error:", err);
    return new Response("Buddy hit a snag. Try again.", { status: 500 });
  }
}
