import { z } from "zod";

export const acceptMessageSchema = z.object({
  accept_message: z.boolean(),
});
