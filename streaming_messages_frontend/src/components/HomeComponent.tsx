import React from "react";
import Image from "next/image";
import { on } from "events";
import { AssistantKey } from "./Settings";

const Lt4670Messages = [
  // "What is the LT4670?",
  // "What are the key features of the LT4670?",
  // "What are the hardware options available for the LT4670?",
  // "How do I control the LT4670?",
  // "Can I configure the SDI output on the LT4670?",
  // "What is the function of the GNSS module (SER01)?"
  "LT4670の主な特長は何ですか？",
  "LT4670-SER01 (GNSS) オプションの機能は何ですか？",
  "LT4670-SER02 (SDI) オプションの機能は何ですか？",
];

const NDIMessages = [
  // "What is the LT4670?",
  // "What are the key features of the LT4670?",
  // "What are the hardware options available for the LT4670?",
  // "How do I control the LT4670?",
  // "Can I configure the SDI output on the LT4670?",
  // "What is the function of the GNSS module (SER01)?"
  "NDI とは何ですか？",
  "NDI はどのように機能しますか？",
  "NDI を使用するメリットは何ですか？",
];

interface HomeInterface {
    onMessageSelect: (message: string) => void;
  onQaChange: (value: boolean) => void;
  asisstant: AssistantKey, // Define the type of the function prop
}


export default function HomeInterface({
  onMessageSelect,
  onQaChange,
  asisstant,
}: HomeInterface) {
  const handleClick = (message: string) => {
    onMessageSelect(message);
    onQaChange(false);
  };
  return (
    <div className="flex flex-col items-center  justify-center h-full">
      {/* <Image
        src="/logo.jpeg"
        alt="StreamChat"
        width={80}
        height={80}
        className="mb-8 rounded-full"
      /> */}
    <div className="grid grid-cols-1 gap-4">
      {asisstant === "lt4670" ? (
        Lt4670Messages.map((message, index) => (
          <div
            key={index}
            className="bg-transparent border-[1px] border-[#ffffff1a] p-4 rounded-lg text-gray-400 cursor-pointer transition-all duration-500 ease-in-out hover:bg-[#2f2f2f] hover:scale-105"
            onClick={() => handleClick(message)}
          >
            {message}
          </div>
        ))
      ) : (
        NDIMessages.map((message, index) => (
          <div
            key={index}
            className="bg-transparent border-[1px] border-[#ffffff1a] p-4 rounded-lg text-gray-400 cursor-pointer transition-all duration-500 ease-in-out hover:bg-[#2f2f2f] hover:scale-105"
            onClick={() => handleClick(message)}
          >
            {message}
          </div>
        ))
      )}
    </div>
    </div>
  );
};
