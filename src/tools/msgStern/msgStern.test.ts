import { describe, expect, it, mock } from "bun:test";
import { msgSternSchema } from "./schema";
import { msgStern, msgSternTool } from "./index";

// Mock OpenAI
mock.module("openai", () => {
	return {
		default: class MockOpenAI {
			chat = {
				completions: {
					create: async () => ({
						choices: [
							{
								message: {
									content: "What about programming calls to you?",
								},
							},
						],
					}),
				},
			};
		},
	};
});

describe("msgStern Tool", () => {
	it("should parse valid input", () => {
		const result = msgSternSchema.safeParse({ message: "Hello Stern" });
		expect(result.success).toBe(true);
	});

	it("should reject empty messages", () => {
		const result = msgSternSchema.safeParse({ message: "" });
		expect(result.success).toBe(false);
	});

	it("should have the correct name and description", () => {
		expect(msgSternTool.name).toBe("msg_stern");
		expect(msgSternTool.description).toContain("philosophical AI mentor");
	});

	it("should handle the main function", async () => {
		// Mock process.env
		process.env.OPENAI_API_KEY = "test-api-key";

		const output = await msgStern({
			message: "I want to learn programming but I keep procrastinating",
		});
		expect(output).toBe("What about programming calls to you?");
	});

	it("should throw an error when OpenAI API key is not set", async () => {
		// Remove API key from environment
		const originalEnv = process.env.OPENAI_API_KEY;
		delete process.env.OPENAI_API_KEY;

		try {
			await expect(msgStern({ message: "Hello" })).rejects.toThrow(
				"OPENAI_API_KEY environment variable is not set"
			);
		} finally {
			// Restore API key
			process.env.OPENAI_API_KEY = originalEnv;
		}
	});
});
