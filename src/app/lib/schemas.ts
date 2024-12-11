import { z } from "zod";

export const documentStructureSchema = z.object({
  title: z.string()
    .describe("The main title of the document"),
  
  sections: z.array(
    z.object({
      heading: z.string()
        .describe("Main section heading"),
      
      subheadings: z.array(
        z.object({
          title: z.string()
            .describe("Subheading title"),
          
          keyPoints: z.array(z.string())
            .describe("Key points under this subheading")
        })
      ).describe("List of subheadings and their key points"),
      
      summary: z.string()
        .optional()
        .describe("Optional section summary")
    })
  ).describe("Document sections with their headings and content")
});

// Add a type export for TypeScript usage
export type DocumentStructure = z.infer<typeof documentStructureSchema>;
