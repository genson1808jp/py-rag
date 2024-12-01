"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatInterface from "./ChatInterface";

export default function ChatbotModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ bottom: 20, right: 20 });
  const modalRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    setPosition((prev) => ({
      bottom: Math.max(prev.bottom - deltaY, 20),
      right: Math.max(prev.right - deltaX, 20),
    }));

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, []);

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <div
          className="fixed z-50 cursor-pointer"
          style={{
            bottom: `${position.bottom}px`,
            right: `${position.right}px`,
          }}
        >
          <button
            onClick={toggleModal}
            className="bg-black w-[60px] h-[60px] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 hover:shadow-xl"
          >
            💬
          </button>
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div
          ref={modalRef}
          className="fixed z-50 w-[500px] h-[700px] rounded-lg shadow-xl bg-white cursor-move"
          style={{
            bottom: `${position.bottom}px`,
            right: `${position.right}px`,
          }}
          onMouseDown={handleDragStart}
        >
          <div className="h-full overflow-hidden">
            <ChatInterface toggleModal={toggleModal} />
          </div>
        </div>
      )}
    </>
  );
}

