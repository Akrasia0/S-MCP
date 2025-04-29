import { z } from "zod";

export const msgSternSchema = z.object({
	message: z
		.string()
		.min(1, "Message is required")
		.describe("The message to send to Stern"),
});

export type MsgSternSchema = z.infer<typeof msgSternSchema>;
