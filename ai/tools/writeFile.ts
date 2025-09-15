import { tool } from "ai";
import { z } from "zod";
import { SandpackFiles } from "@codesandbox/sandpack-react";

export const writeFile = ({ files }: { files: SandpackFiles }) =>
  tool({
    description:
      "Creates a new file or updates an existing file with specified code. Returns success status and file information. Use clause when asked for a good design.",
    inputSchema: z.object({
      path: z.string().describe("File path to if the file to create or update"),
      code: z.string().describe("The code to write to the file"),
    }),

    execute: async ({ path, code }) => {
      try {
        return {
          status: "success",
          path,
          code,
        };
      } catch (error) {
        console.error("Error writing file:", error);
        return {
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    },
  });
