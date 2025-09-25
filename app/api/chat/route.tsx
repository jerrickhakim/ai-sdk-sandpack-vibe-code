import { streamText, UIMessage, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, stepCountIs } from "ai";
import { z } from "zod";

import { tools } from "@/ai/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const bodySchema = z.object({
  id: z.string().optional(),
  messages: z.array(z.any()),
  files: z.record(
    z.string(),
    z.object({
      code: z.string(),
      readOnly: z.boolean().optional(),
      active: z.boolean().optional(),
      hidden: z.boolean().optional(),
    })
  ),
  message: z.any().optional(),
});

const PROMPT = `
You are a developer assistant that can help with coding tasks.
You are working in a React Tailwind v4 app.

Files: {{files}}

When installing packages, you will only add them to the package.json file. Then the system will add them automatically.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedBody = bodySchema.parse(body);

    const { messages } = validatedBody;
    let files = validatedBody.files;
    // console.log("files", files);

    const filesPaths: string = Object.keys(files).join("\n");
    const prompt = PROMPT.replace("{{files}}", filesPaths);
    // console.log(prompt);

    const stream = createUIMessageStream<any>({
      originalMessages: convertToModelMessages(messages),
      execute: async ({ writer }) => {
        const _tools = tools({ files, writer });

        const result = await streamText({
          system: prompt,
          // model: "google/gemini-2.5-flash",
          model: "moonshotai/kimi-k2",
          // model: "anthropic/claude-sonnet-4",
          // model: "openai/gpt-5",
          messages: convertToModelMessages(messages),
          tools: _tools,
          // You could use write file, or use the textEdit, certain models writeFile may be a better method
          // activeTools: ["writeFile"],
          activeTools: ["textEditor"],
          toolChoice: "auto",
          maxOutputTokens: 8192,
          stopWhen: stepCountIs(5),
          onStepFinish: (args) => {
            // https://v5.ai-sdk.dev/docs/ai-sdk-ui/streaming-data
            const toolCalls = args.content.filter((part) => part.type === "tool-result");

            toolCalls.map((toolCall) => {
              writer.write({
                type: `data-tool-result-${toolCall.toolName}`,
                data: toolCall,
                transient: true,
              });
            });
          },
        });

        result.consumeStream();

        // Write stream method
        writer.merge(
          result.toUIMessageStream({
            sendReasoning: true,
            originalMessages: messages,
            messageMetadata: ({ part }) => {},
          })
        );
      },
    });

    return createUIMessageStreamResponse({
      stream,
      status: 200,
      statusText: "OK",
      headers: {},
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
