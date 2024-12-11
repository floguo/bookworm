import { documentStructureSchema } from "@/app/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = await streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content:
          "You are a document analyzer. Extract the document structure including title, main headings, subheadings, and key points under each section. Organize the information hierarchically.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please analyze this document and extract its structure with headings, subheadings, and key points.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: documentStructureSchema,
    output: "object",
    onFinish: ({ object }) => {
      const res = documentStructureSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
