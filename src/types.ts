import {
	type CallToolResult,
	type Tool,
	ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";

const ToolInputSchema = ToolSchema.shape.inputSchema;
export type ToolInput = z.infer<typeof ToolInputSchema>;

export type ToolRegistration<T> = Tool & {
	handler: (args: T) => CallToolResult | Promise<CallToolResult>;
};

export interface Character {
	name: string;
	agentId: string;
	routes: string[];
	system: string;
	bio: string[];
	lore: string[];
	messageExamples: Array<
		Array<{
			user: string;
			content: {
				text: string;
			};
		}>
	>;
	postExamples: string[];
	topics: string[];
	style: {
		all: string[];
		chat: string[];
		post: string[];
	};
	adjectives: string[];
}
