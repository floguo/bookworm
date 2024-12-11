import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  const result = streamText({
    model: google('gemini-1.5-pro-latest'),
    messages: [
      {
        role: "system",
        content: "You are an AI assistant specialized in analyzing documents. Your task is to extract the main key points from the given document. For each key point, provide a title and brief content. Format your response as JSON with the following structure: { \"keyPoints\": [{ \"title\": \"Key Point Title\", \"content\": \"Key Point Content\" }] }"
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the main key points from this document.",
          },
          {
            type: "file",
            data: base64,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
  });

  return result.toDataStreamResponse();
}

