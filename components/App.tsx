"use client";

// React
import React, { useState, useEffect, memo } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import { AnimatePresence, motion } from "framer-motion";

// Components
import Preview from "@/components/Preview";
import Chat from "@/components/Chat";

// Stores
import { $files } from "@/stores/appStore";

function View({}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rightAsideClassNames = "hidden md:block md:right-0 md:top-0 md:bottom-0 md:relative h-full rounded-lg overflow-hidden";

  const handleResize = (sizes: { right: number }) => {
    // setSizes(sizes);
    const rightPanel = document.getElementById("right-panel");
    if (rightPanel) {
      rightPanel.style.width = `${sizes.right}px`;
    }
  };

  if (!mounted) return null;

  return (
    <main className="bg-background h-[100dvh] flex flex-col md:py-[20px]">
      {/* <DraggableResizeableIframe /> */}
      <div className="flex-1 min-h-0 flex items-center justify-center md:px-[10px]">
        <AnimatePresence mode="wait">
          <PanelGroup
            direction="horizontal"
            className="@container/view w-full items-stretch h-full"
            key="chatOpen"
            onLayout={(layout) => handleResize({ right: layout[1] })}
          >
            <>
              {/* Chat */}
              <Panel
                id="left-panel"
                order={1}
                data-disable-resize="false"
                defaultSize={27}
                minSize={0}
                className="relative z-10 @container/left-panel h-full"
              >
                <motion.div
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  // layoutId="left-panel"
                  className="max-w-3xl mx-auto h-full flex flex-col min-h-0"
                >
                  <Chat />
                </motion.div>
              </Panel>

              {/* Resize handle */}
              <PanelResizeHandle
                className="hidden @lg/view:flex w-[10px] h-full items-center justify-center bg-transparent group cursor-col-resize"
                onDragging={(isDragging) => {
                  const elements = document.querySelectorAll("[data-disable-resize]");
                  if (isDragging) {
                    elements.forEach((element) => {
                      element.setAttribute("data-disable-resize", "true");
                    });
                  } else {
                    elements.forEach((element) => {
                      element.setAttribute("data-disable-resize", "false");
                    });
                  }
                }}
              >
                <div className="w-[2px] h-[30px] bg-zinc-700 rounded-full group-hover:bg-blue-500 transition-colors duration-200"></div>
              </PanelResizeHandle>
            </>

            {/* Right panel */}
            <Panel
              order={2}
              data-disable-resize="false"
              defaultSize={73}
              minSize={0}
              className={rightAsideClassNames + " h-full"}
              id="right-panel"
            >
              <Preview />
            </Panel>
          </PanelGroup>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default View;
