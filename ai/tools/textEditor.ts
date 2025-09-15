import { tool } from "ai";
import { z } from "zod";
import { SandpackFiles } from "@codesandbox/sandpack-react";

// Utility helpers
const normalize = (p: string) => (!p.startsWith("/") ? "/" + p : p);

// Command handlers
export const textEditorHandlers = {
  view: async ({ path, view_range }: any, context: { files: any }) => {
    const p = normalize(path);
    const { files } = context;

    if (path === "/") {
      return { status: "success", data: Object.keys(files).join("\n") };
    }

    if (!files[p]) {
      return { status: "error", message: `Path not found: ${path}` };
    }

    const entry = files[p];

    // File exists

    const content = entry.code || "";
    if (view_range) {
      const { start, end } = view_range;
      const lines = content.split("\n");
      const slice = lines.slice(start - 1, end === -1 ? undefined : end);
      return {
        status: "success",
        data: slice.join("\n"),
      };
    }
    return {
      status: "success",
      data: content,
    };
  },

  str_replace: async ({ path, old_str, new_str }: any, context: { files: any }) => {
    if (!old_str || new_str === undefined) {
      return { status: "error", message: "old_str and new_str are required for str_replace" };
    }

    const p = normalize(path);
    const { files } = context;
    const entry = files[p];

    if (!entry) {
      return { status: "error", message: `File not found: ${path}` };
    }

    const current = entry.code || "";
    if (!current.includes(old_str)) {
      return { status: "error", message: "String not found in file" };
    }

    const updated = current.replace(old_str, new_str);
    files[p].code = updated;
    return {
      status: "success",
      content: updated,
      metadata: {
        old_str: old_str.slice(0, 100),
        new_str: new_str.slice(0, 100),
      },
    };
  },

  create: async ({ files, path, file_text }: any) => {
    const p = normalize(path);
    files[p] = {
      path: p,
      name: p.split("/").pop()!,
      lastModified: new Date().toISOString(),
      content: file_text,
      type: "file",
    };

    return {
      status: "success",
      content: file_text,
    };
  },

  // insert
  insert: ({ path, new_str, insert_line }: any, context: { files: any }) => {
    if (new_str === undefined || insert_line === undefined) {
      return { status: "error", message: "new_str and insert_line are required for insert command" };
    }

    const p = normalize(path);
    const { files } = context;
    const original = files[p]?.code || "";
    const lines = original.split("\n");

    if (insert_line < 0 || insert_line > lines.length) {
      return {
        status: "error",
        message: `Invalid insert_line: ${insert_line}. Must be between 0 and ${lines.length}`,
      };
    }

    lines.splice(insert_line, 0, ...new_str.split("\n"));
    const updated = lines.join("\n");
    files[p].code = updated;

    return {
      status: "success",
      content: updated,
      metadata: {
        insert_line,
        lines_inserted: new_str.split("\n").length,
        path: p,
      },
    };
  },

  delete: ({ path }: any) => {
    const p = normalize(path);
    return { status: "success", path: p };
  },
};

export const textEditor = ({ files }: { files: SandpackFiles }) =>
  tool({
    description:
      "Full‑featured text‑editing helper (view, str_replace, create, insert, delete). When you need to rewrite an entire file use create as the command. You may use create when changing for than 50% of the file. You cannot save .png images this way. You will edit the files and not return code in the chat.",
    inputSchema: z.object({
      command: z.enum(["view", "str_replace", "create", "insert", "delete"]),
      path: z.string(),
      file_text: z.string().optional(),
      insert_line: z.number().int().gte(0).optional(),
      new_str: z.string().optional(),
      old_str: z.string().optional(),
      view_range: z
        .object({
          start: z.number().int().gte(1),
          end: z.number().int().gte(-1),
        })
        .optional(),
    }),
    execute: async (args, context) => {
      const { command } = args;
      const handler = textEditorHandlers[command as keyof typeof textEditorHandlers];

      if (!handler) {
        return {
          status: "error",
          message: `Unknown command: ${command}. Supported commands: ${Object.keys(textEditorHandlers).join(", ")}`,
        };
      }

      return handler(args, { files });
    },
  });
