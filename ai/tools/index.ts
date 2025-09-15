import { textEditor } from "./textEditor";
import { SandpackFiles } from "@codesandbox/sandpack-react";
import { writeFile } from "./writeFile";

export const tools = ({ files, writer }: { files: SandpackFiles; writer: any }) => {
  return { textEditor: textEditor({ files }), writeFile: writeFile({ files }) };
};
