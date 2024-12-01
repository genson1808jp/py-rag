"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import HomeComponent from "./HomeComponent";
import Settings, { StreamMode } from "./Settings";
import { Message, Model } from "../types";
import { handleStreamEvent } from "../utils/streamHandler";
import {
  createAssistant,
  createThread,
  getThreadState,
  sendMessage,
} from "../utils/chatApi";
import { ASSISTANT_ID_COOKIE } from "@/constants";
import { getCookie, setCookie } from "@/utils/cookies";
import { ThreadState } from "@langchain/langgraph-sdk";
import { GraphInterrupt } from "./Interrupted";
import { Resizable } from "re-resizable";
import  Draggable  from "react-draggable";
import { FiX } from "react-icons/fi"; // Thêm icon đóng
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"; // Icon mở chat

interface ChatInterfaceProps {
  toggleModal: () => void; // Define the type of the function prop
}

export default function ChatInterface( { toggleModal }: ChatInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [model, setModel] = useState<Model>("gpt-4o-mini" as Model);
  const [streamMode, setStreamMode] = useState<StreamMode>("messages");
  const [userId, setUserId] = useState<string>("");
  const [systemInstructions, setSystemInstructions] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadState, setThreadState] =
    useState<ThreadState<Record<string, any>>>();
  const [graphInterrupted, setGraphInterrupted] = useState(false);
  const [allowNullMessage, setAllowNullMessage] = useState(false);

  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      let assistantId = getCookie(ASSISTANT_ID_COOKIE);
      if (!assistantId) {
        const assistant = await createAssistant(
          // process.env.NEXT_PUBLIC_LANGGRAPH_GRAPH_ID as string
          "retrieval_graph"
        );
        assistantId = assistant.assistant_id as string;
        setCookie(ASSISTANT_ID_COOKIE, assistantId);
        setAssistantId(assistantId);
      }

      const { thread_id } = await createThread();
      setThreadId(thread_id);
      setAssistantId(assistantId);
      setUserId(uuidv4());
    };

    initializeChat();
  }, []);

  useEffect(() => {
    console.log(messages)
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string | null) => {
    const messageId = uuidv4();
    if (message !== null) {
      setMessages([
        ...messages,
        { text: message, sender: "user", id: messageId },
      ]);
    }

    if (!threadId) {
      console.error("Thread ID is not available");
      return;
    }
    if (!assistantId) {
      console.error("Assistant ID is not available");
      return;
    }

    try {
      setIsLoading(true);
      setThreadState(undefined);
      setGraphInterrupted(false);
      setAllowNullMessage(false);
      const response = await sendMessage({
        threadId,
        assistantId,
        message,
        messageId,
        model,
        userId,
        systemInstructions,
        streamMode,
      });

      for await (const chunk of response) {
        handleStreamEvent(chunk, setMessages, streamMode);
      }

      // Fetch the current state of the thread
      const currentState = await getThreadState(threadId);
      setThreadState(currentState);
      if (currentState.next.length) {
        setGraphInterrupted(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error streaming messages:", error);
      setIsLoading(false);
    }
  };

  const [position, setPosition] = useState({ bottom: 20, right: 20 });
  const modalRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    setPosition((prev) => ({
      bottom: Math.max(prev.bottom - deltaY, 20), // Avoid negative values
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
    <div className="w-full h-full bg-[#212121] overflow-hidden rounded-lg shadow-md">
  <Settings
    toggleModal={toggleModal}
    onModelChange={setModel}
    onSystemInstructionsChange={setSystemInstructions}
    currentModel={model as any}
    currentSystemInstructions={systemInstructions}
    onStreamModeChange={setStreamMode}
    currentStreamMode={streamMode}
  />
  {messages.length === 0 ? (
    <HomeComponent onMessageSelect={handleSendMessage} />
  ) : (
    <div ref={messageListRef} className="overflow-y-auto h-full">
      <MessageList messages={messages} />
      {!!graphInterrupted && !!threadState && !!threadId ? (
        <div className="flex items-center justify-start w-2/3 mx-auto">
          <GraphInterrupt
            setAllowNullMessage={setAllowNullMessage}
            threadId={threadId}
            state={threadState}
          />
        </div>
      ) : null}
      {allowNullMessage && (
        <div className="flex flex-col w-2/3 mx-auto overflow-y-scroll pb-[100px]">
          <button
            onClick={async () => handleSendMessage(null)}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 max-w-[400px] mx-auto"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )}
  <InputArea onSendMessage={handleSendMessage} />
</div>

  );
}
