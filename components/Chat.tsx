"use client";

import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Streamdown } from "streamdown";
import { $files, setFile } from "@/stores/appStore";
import { PanelLeft } from "lucide-react";
import { Button } from "@heroui/react";
import Sidebar, { SidebarTrigger } from "./Sidebar";

export default function Chat() {
  const [input, setInput] = useState("");
  const messageScrollRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const toolMap = {
    textEditor: (toolCall: any) => {
      console.log("textEditor", toolCall);

      const { input, output } = toolCall;

      const { command, path } = input;
      console.log("command", command);

      if (command === "view") {
        return;
      }

      if (command === "delete") {
        const files = $files.get();
        console.log("files", files[path]);
        delete files[path];
        $files.set(files);

        return;
      }

      if (!output) {
        console.log("No output");
        return;
      }

      const { content } = output;
      console.log("content", content);

      if (command === "insert" || command === "str_replace" || command === "create") {
        try {
          setFile(path, {
            code: content,
          });
        } catch (error) {
          console.error("Error saving file", error);
        }

        // addToast({
        //   title: "File Saved",
        //   description: `File ${path} saved`,
        //   color: "success",
        // });
      }

      return toolCall.output;
    },
  };

  type ToolMap = keyof typeof toolMap;
  const { messages, sendMessage, stop, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      async prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            id,
            files: $files.get(),
            message: messages.length > 0 ? messages[messages.length - 1] : null,
            messages: messages,
            ...body,
          },
        };
      },
    }),
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === "writeFile") {
        const { input } = toolCall;
        const { path, code } = input as any;
        setFile(path, {
          code: code,
        });
      }
    },
    onData: async (dataPart) => {
      if (dataPart.type === "data-tool-result-textEditor") {
        const result = toolMap.textEditor(dataPart.data);
        console.log("result", result);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = messageScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  //
  const lastMessage = useMemo(() => {
    return messages[messages.length - 1];
  }, [messages]);

  // If you want to auto scroll to bottom use this and uncomment the requestAnimationFrame in submit
  // useEffect(() => {
  //   scrollToBottom("smooth");
  // }, [lastMessage]);

  // Auto-resize textarea up to a max height, then allow scrolling
  useLayoutEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;
    const MAX_TEXTAREA_HEIGHT_PX = 300;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT_PX ? "auto" : "hidden";
  }, [input]);

  const submit = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
    // Scroll after React paints the new message
    requestAnimationFrame(() => scrollToBottom("smooth"));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full">
      <header className="px-4 bg-card flex items-center justify-between rounded-2xl h-[54px]">
        <SidebarTrigger />
      </header>
      {/* Messages */}
      <div ref={messageScrollRef} className="flex-1 min-h-0 overflow-y-auto scroll-smooth scrollbar-hide">
        <div className="flex flex-col space-y-2 items-start p-4 h-full max-w-2xl mx-auto">
          {/* <pre>{JSON.stringify(messages, null, 2)}</pre> */}
          {messages.map((m) => (
            <div key={m.id} data-message-role={m.role} className="last:min-h-[calc(100dvh-200px)]">
              {m.role === "user" ? "User: " : "AI: "}
              {m.parts.map((part, i) =>
                part.type === "text" ? (
                  <div key={`${m.id}-${i}`}>
                    <Streamdown>{part.text}</Streamdown>
                  </div>
                ) : null
              )}
            </div>
          ))}
          {error && <div className="text-sm text-red-500">{error.message}</div>}
        </div>
      </div>

      {/* Input */}
      <div className="relative bottom-0 left-0 right-0">
        <div className="max-w-2xl mx-auto p-2 backdrop-blur-xl rounded-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="w-full flex flex-col"
          >
            <div className="flex flex-col items-end overflow-x-hidden h-full max-h-[300px] transition-all duration-300 relative p-[.5px] rounded-2xl border border-zinc-800">
              <textarea
                ref={textAreaRef}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    submit();
                  }
                }}
                className="w-full rounded-t-2xl focus:outline-none p-3 resize-none overflow-y-auto text-ellipsis max-h-[300px]"
                placeholder="Type your message..."
              />

              <div className="absolute bottom-1 right-1">
                {status === "streaming" ? (
                  <button type="button" className="py-1 px-2 rounded-lg text-sm bg-red-500 text-primary-foreground" onClick={stop}>
                    Stop
                  </button>
                ) : (
                  <button type="submit" className="py-1 px-2 rounded-lg text-sm bg-primary text-primary-foreground">
                    Send
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}
