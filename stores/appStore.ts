import { atom } from "nanostores";
import codebase from "@/data/codebase.json";
import { useStore } from "@nanostores/react";
import { SandpackFile } from "@codesandbox/sandpack-react";

export const $files = atom<{ [key: string]: SandpackFile }>(codebase);

export const setFile = (path: string, file: SandpackFile) => {
  const currentFiles = $files.get();
  let currentFile = currentFiles[path];

  // Handle new file init the object
  if (!currentFile) {
    currentFile = {
      code: "",
      readOnly: false,
      active: false,
      hidden: false,
    };
  }

  // Update file
  currentFile.code = file.code;

  const updatedFiles = { ...currentFiles, [path]: currentFile };
  $files.set(updatedFiles);
};

export const useFiles = () => {
  return useStore($files);
};

//
// Preview tabs
//
export const $activeTab = atom<"preview" | "code">("preview");

export const setActiveTab = (tab: "preview" | "code") => {
  $activeTab.set(tab);
};

export const useActiveTab = () => {
  return useStore($activeTab);
};

//
// Sidebar state
//
export const $sidebarOpen = atom<boolean>(false);

export const setSidebarOpen = (open: boolean) => {
  $sidebarOpen.set(open);
};

export const useSidebarOpen = () => {
  return useStore($sidebarOpen);
};
