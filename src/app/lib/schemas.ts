import { z } from "zod";

export const keyPointSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const keyPointsSchema = z.array(keyPointSchema);

