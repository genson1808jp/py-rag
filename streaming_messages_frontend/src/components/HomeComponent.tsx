import React from "react";
import Image from "next/image";

const exampleMessages = [
  // "What is the LT4670?",
  // "What are the key features of the LT4670?",
  // "What are the hardware options available for the LT4670?",
  // "How do I control the LT4670?",
  // "Can I configure the SDI output on the LT4670?",
  // "What is the function of the GNSS module (SER01)?"
  "LT4670の主な特長は何ですか？",
  "LT4670-SER01 (GNSS) オプションの機能は何ですか？",
  "LT4670-SER02 (SDI) オプションの機能は何ですか？",
  "LT4670-SER03 (PTP) オプションの機能は何ですか？",
  "LT4670はどのような規格に対応していますか？",
];

const HomeComponent: React.FC<{
  onMessageSelect: (message: string) => void;
}> = ({ onMessageSelect }) => {
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
        {exampleMessages.map((message, index) => (
          <div
            key={index}
            className="bg-transparent border-[1px] border-[#ffffff1a] p-4 rounded-lg text-gray-400 cursor-pointer transition-all duration-500 ease-in-out hover:bg-[#2f2f2f] hover:scale-105"
            onClick={() => onMessageSelect(message)}
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeComponent;
