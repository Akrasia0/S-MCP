#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the MCP server executable
const serverPath = path.join(__dirname, "..", "dist", "main.js");

async function main() {
	// Start the MCP server as a child process
	const serverProcess = spawn("node", [serverPath], {
		stdio: ["pipe", "pipe", "pipe"],
	});

	// Create a client that communicates with the server via stdio
	const transport = new StdioClientTransport({
		stdin: serverProcess.stdin,
		stdout: serverProcess.stdout,
	});

	const client = new Client({
		capabilities: {
			tools: {},
		},
	});
	await client.connect(transport);

	try {
		// Get server info
		const serverInfo = await client.getServerInfo();
		console.log(
			"Connected to server:",
			serverInfo.name,
			"v" + serverInfo.version
		);

		// List available tools
		const { tools } = await client.listTools();
		console.log("\nAvailable tools:");
		tools.forEach((tool) => {
			console.log(`- ${tool.name}: ${tool.description}`);
		});

		// Send a message to Stern
		console.log("\nSending message to Stern...");
		const result = await client.callTool("msg_stern", {
			message: "I want to learn programming but I keep procrastinating",
		});

		// Display Stern's response
		console.log("\nStern's response:");
		if (result.content && result.content.length > 0) {
			console.log(result.content[0].text);
		} else {
			console.log("No response received");
		}
	} catch (error) {
		console.error("Error:", error);
	} finally {
		// Disconnect from the server
		await client.disconnect();

		// Terminate the server process
		serverProcess.kill();
	}
}

main().catch(console.error);
