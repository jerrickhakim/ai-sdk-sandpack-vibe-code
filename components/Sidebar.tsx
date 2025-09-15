"use client";
import React from "react";
import { Drawer } from "vaul";
import { useStore } from "@nanostores/react";
import { $sidebarOpen, setSidebarOpen } from "@/stores/appStore";
import { XIcon, MenuIcon } from "lucide-react";
import { Button } from "@heroui/react";

export const SidebarTrigger = () => {
  const sidebarOpen = useStore($sidebarOpen);

  return (
    <Button isIconOnly variant="light" size="sm" onPress={() => setSidebarOpen(!sidebarOpen)} className="p-2">
      <MenuIcon size={16} />
    </Button>
  );
};

export default function Sidebar() {
  const sidebarOpen = useStore($sidebarOpen);

  const handleClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Drawer.Root open={sidebarOpen} onClose={handleClose} direction="left">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-10" />
        <Drawer.Content className="bg-background flex flex-col rounded-r-2xl h-[calc(100%-40px)] fixed bottom-[20px] top-[20px] left-0 z-30 overflow-hidden w-80">
          <Drawer.Title className="font-medium mb-4 text-lg sr-only">Sidebar</Drawer.Title>

          {/* Header */}
          <header className="flex items-center justify-between bg-card h-[50px] px-4 border-b border-border">
            <div className="flex gap-2 items-center">
              <span className="font-medium">Sidebar</span>
            </div>

            <Button size="sm" variant="light" onPress={handleClose} isIconOnly className="bg-card/40">
              <XIcon size={16} />
            </Button>
          </header>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-medium mb-2">Navigation</h3>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg hover:bg-accent cursor-pointer">Dashboard</div>
                  <div className="p-2 rounded-lg hover:bg-accent cursor-pointer">Projects</div>
                  <div className="p-2 rounded-lg hover:bg-accent cursor-pointer">Settings</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-medium mb-2">Recent</h3>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg hover:bg-accent cursor-pointer">Project Alpha</div>
                  <div className="p-2 rounded-lg hover:bg-accent cursor-pointer">Project Beta</div>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
