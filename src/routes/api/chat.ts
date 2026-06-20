import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };
type Body = { messages?: ChatMsg[]; persona?: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) {
          return new Response("messages required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const persona = body.persona?.trim() || "a friendly chat partner";
        const system = `You are ${persona} in a casual messenger app called CHATTERBOX. Reply naturally and conversationally, like a real friend texting back. Keep replies short (1-3 sentences usually), warm, and human. Avoid corporate or robotic phrasing. Do not use markdown formatting.`;

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            system,
            messages: messages.slice(-30).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          });
          return Response.json({ text });
        } catch (err: unknown) {
          const e = err as { statusCode?: number; message?: string };
          const status = e.statusCode ?? 500;
          if (status === 429) {
            return Response.json({ error: "Rate limit reached. Try again in a moment." }, { status: 429 });
          }
          if (status === 402) {
            return Response.json({ error: "AI credits exhausted. Add credits in your workspace settings." }, { status: 402 });
          }
          return Response.json({ error: e.message ?? "AI request failed" }, { status: 500 });
        }
      },
    },
  },
});
