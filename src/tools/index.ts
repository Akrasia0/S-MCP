import type { ToolRegistration } from "@/types";
import { msgSternTool } from "./msgStern";

// biome-ignore lint/suspicious/noExplicitAny: Any is fine here because all tools validate their input schemas.
export const createTools = (): ToolRegistration<any>[] => {
	return [
		{
			...msgSternTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => msgSternTool.handler(args),
		},
	];
};
