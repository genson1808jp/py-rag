import React, { useRef, useEffect, ReactNode } from "react";
import Message from "./Message";
import { Message as MessageType } from "../types";
import HomeComponent from "./HomeComponent";

export default function MessageList({ messages, qaComponent }: { messages: MessageType[], qaComponent: ReactNode}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="pb-[100px] mx-auto p-10 overflow-y-scroll " // h-full
    >
      {messages.map((message, index) => (
        <div key={index}>
          <Message
            rawResponse={message.rawResponse}
            text={message.text}
            sender={message.sender}
            toolCalls={message.toolCalls}
          />
        </div>
      ))}
      {/* Invisible div to act as scroll target */}
      <div ref={bottomRef} />
      { qaComponent }
    </div>
  );
}
