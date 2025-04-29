#!/usr/bin/env node

// Version is automatically updated during release process
export const VERSION = "0.1.0";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createTools } from "./tools";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/* You can remove this section if you don't need to validate command line arguments */
/* You'll have to handle the error yourself */
/*
const expectedArgs = [
	"expected-arg-1",
	"expected-arg-2",
]
const args = process.argv.slice(2);
if (args.length < expectedArgs.length) {
	console.error("CLI arguments not provided. If you are getting this error and don't know why, you probably need to remove CLI argument logic in main.ts");
	process.exit(1);
}
*/

// Create tools first
const tools = createTools();

// Initialize server with tools in capabilities
const server = new Server(
	{
		name: "Stern AI Mentor MCP Server",
		version: VERSION,
	},
	{
		capabilities: {
			tools: tools.reduce((acc, tool) => {
				const { handler, ...toolInfo } = tool;
				acc[tool.name] = toolInfo;
				return acc;
			}, {} as Record<string, any>),
		},
	}
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: tools.map(({ handler, ...tool }) => tool),
}));

// Register tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	try {
		const { name, arguments: args } = request.params;
		const tool = tools.find((t) => t.name === name);

		if (!tool) {
			throw new Error(`Unknown tool: ${name}`);
		}

		return tool.handler(args);
	} catch (error) {
		return {
			content: [
				{
					type: "text",
					text: `Error: ${
						error instanceof Error ? error.message : String(error)
					}`,
				},
			],
			isError: true,
		};
	}
});

// Start server
async function runServer() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Stern AI Mentor MCP Server running on stdio");
}

runServer().catch((error) => {
	console.error("Fatal error running server:", error);
	process.exit(1);
});
