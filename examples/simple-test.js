#!/usr/bin/env node

import { spawn } from "child_process";
import { createInterface } from "readline";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the MCP server executable
const serverPath = path.join(__dirname, "..", "dist", "main.js");

// Start the MCP server as a child process
const serverProcess = spawn("node", [serverPath], {
	stdio: ["pipe", "pipe", "inherit"],
});

// Create readline interface for server's stdout
const rl = createInterface({
	input: serverProcess.stdout,
	crlfDelay: Infinity,
});

// Listen for server output
rl.on("line", (line) => {
	try {
		const data = JSON.parse(line);
		console.log("Received from server:", JSON.stringify(data, null, 2));

		// If this is a tools list response, send a tool call request
		if (data.jsonrpc === "2.0" && data.result && data.result.tools) {
			console.log("Tools list received, sending tool call request...");

			// Send a request to call the msg_stern tool
			const request = {
				jsonrpc: "2.0",
				id: "test-call",
				method: "callTool",
				params: {
					name: "msg_stern",
					arguments: {
						message: "I want to learn programming but I keep procrastinating",
					},
				},
			};

			serverProcess.stdin.write(JSON.stringify(request) + "\n");
		}

		// If this is a tool call response, exit
		if (data.jsonrpc === "2.0" && data.result && data.result.content) {
			console.log("\nStern's response:");
			console.log(data.result.content[0].text);

			// Exit after receiving the response
			setTimeout(() => {
				serverProcess.kill();
				process.exit(0);
			}, 1000);
		}
	} catch (error) {
		// Not JSON or other error
		console.log("Server output:", line);
	}
});

// Send a request to list tools
const listToolsRequest = {
	jsonrpc: "2.0",
	id: "test-list",
	method: "listTools",
};

// Write the request to the server's stdin
serverProcess.stdin.write(JSON.stringify(listToolsRequest) + "\n");

// Handle process termination
process.on("SIGINT", () => {
	serverProcess.kill();
	process.exit(0);
});

// Handle server process exit
serverProcess.on("exit", (code) => {
	console.log(`Server process exited with code ${code}`);
	process.exit(code);
});
