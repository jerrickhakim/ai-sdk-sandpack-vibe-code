"use client";

// React
import React, { useCallback } from "react";

// Components
import {
  Sandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackConsole,
  SandpackFiles,
  SandpackFile,
} from "@codesandbox/sandpack-react";
import { useFiles, useActiveTab, setActiveTab, $activeTab } from "@/stores/appStore";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { Tabs, Tab } from "@heroui/react";
const Header = () => {
  const activeTab = useActiveTab();
  const setActiveTab = (value: "preview" | "code") => {
    $activeTab.set(value);
  };

  return (
    <div className="flex h-[54px] px-2 items-center">
      <Tabs size="sm" color="primary" selectedKey={activeTab} onSelectionChange={(value) => setActiveTab(value as "preview" | "code")}>
        <Tab key="preview" title="Preview" />
        <Tab key="code" title="Code" />
      </Tabs>
    </div>
  );
};

const Preview: React.FC = () => {
  const files = useFiles();

  const activeTab = useActiveTab();

  return (
    <div className="bg-[#181818] rounded-2xl">
      <Header />
      {activeTab === "preview" && (
        <SandpackProvider
          files={files as unknown as SandpackFiles}
          theme="auto"
          template="react"
          customSetup={{
            entry: "/src/main.tsx",
          }}
          className="h-full"
          options={{
            externalResources: ["https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"],
            experimental_enableServiceWorker: true,
            experimental_enableStableServiceWorkerId: true,
            autoReload: true,
          }}
        >
          <SandpackLayout className="w-full flex items-center justify-center h-[calc(100dvh-20px)] md:h-[calc(100dvh-20px)]">
            <SandpackPreview data-disable-resize="false" />
          </SandpackLayout>
        </SandpackProvider>
      )}

      {activeTab === "code" && (
        <SandpackProvider
          files={files as unknown as SandpackFiles}
          theme="auto"
          template="react"
          className="h-full"
          options={{
            externalResources: ["https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"],
            experimental_enableServiceWorker: true,
            experimental_enableStableServiceWorkerId: true,
            autoReload: true,
          }}
        >
          <SandpackLayout className="w-full flex items-center justify-center h-[calc(100dvh-20px)] md:h-[calc(100dvh-20px)]">
            <SandpackFileExplorer /> <SandpackCodeEditor showTabs showLineNumbers={false} showInlineErrors wrapContent closableTabs />
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
};

export default Preview;
