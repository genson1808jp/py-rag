import { useState } from "react";
import { FiX } from "react-icons/fi";

export type Model = "gpt-4o"| "haiku"| "gpt-4o-mini"| "sonnet-3.5";
export type Assistant = {key: "ndi-checker", value: "NDI Checker"} | {key: "lt4670", value: "LT4670"} | {key: "customer-care", value: "Customer Care"};
export type AssistantKey = "ndi-checker" | "lt4670" | "customer-care";
export type StreamMode = "messages" | "values" | "updates" | "events";

  const AssistantData = new Map<string, string>([
    ["ndi-checker",  "NDI Checker" ],
    ["lt4670",  "LT4670"],
    ["customer-care", "Customer Care" ],
  ]);

interface SettingsProps {
  onModelChange: (model: Model) => void;
  onAssistantChange: (assistant: AssistantKey) => void;
  onSystemInstructionsChange: (instructions: string) => void;
  onStreamModeChange: (mode: StreamMode) => void;
  onQaChange: (value: boolean) => void;
  currentModel: Model;
  currentAssistant: AssistantKey;
  currentSystemInstructions: string;
  currentStreamMode: StreamMode;
  toggleModal: () => void;
}

export default function Settings({
  onModelChange,
  onAssistantChange,
  onSystemInstructionsChange,
  onQaChange,
  onStreamModeChange,
  currentModel,
  currentAssistant,
  currentSystemInstructions,
  currentStreamMode,
  toggleModal,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const models: Model[] = ["gpt-4o", "haiku", "gpt-4o-mini", "sonnet-3.5"];
  const Asisstants: Assistant[] = [{key: "ndi-checker", value: "NDI Checker"} , {key: "lt4670", value: "LT4670"} , {key: "customer-care", value: "Customer Care"}];
  const streamModes: StreamMode[] = ["messages", "values", "updates", "events"];

  return (
    <div className="absolute justify-between left-0 flex right-0 rounded-t-lg z-20 bg-black ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-xl text-white"
      >
        ⚙️
      </button>
      <select
            value={currentAssistant}
            onChange={(e) => {
              onAssistantChange(e.target.value as AssistantKey);
              setIsOpen(false);
            }}
            className="w-200 p-2 text-gray-100 rounded bg-black  text-base focus:outline-none"
          >
            {Asisstants.map((assistant) => (
              <option key={assistant.key} value={assistant.key}>
                {assistant.value}
              </option>
            ))}
        </select>
        <button  onClick={() => onQaChange(true)} className="p-2 text-wrap text-white">
          Q/A
        </button>
      <button
        className=" text-red-800  mr-1 hover:text-red-500 transition-colors focus:outline-none"
        onClick={toggleModal} // Replace with your click handler
      >
        <FiX className="w-8 h-8 " />
      </button>
      {isOpen && (
        <div className="absolute left-3  mt-10 w-64 bg-gray-800 rounded-md shadow-lg z-10 p-4">
          <h3 className="font-bold mt-4 mb-2 text-gray-100">Model</h3>
          <select
            value={currentModel}
            onChange={(e) => {
              onModelChange(e.target.value as Model);
              setIsOpen(false);
            }}
            className="w-full p-2 border text-gray-100 rounded bg-gray-700 text-sm focus:outline-none"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>

          <h3 className="font-bold mt-4 mb-2 text-gray-100">Stream Mode</h3>
          <select
            value={currentStreamMode}
            onChange={(e) => {
              onStreamModeChange(e.target.value as StreamMode);
              setIsOpen(false);
            }}
            className="w-full p-2 border text-gray-100 rounded bg-gray-700 text-sm focus:outline-none"
          >
            {streamModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>

          <h3 className="font-bold mt-4 mb-2 text-gray-100">
            System Instructions
          </h3>
          <textarea
            value={currentSystemInstructions}
            onChange={(e) => onSystemInstructionsChange(e.target.value)}
            className="w-full h-12 p-2 border rounded bg-gray-700 text-sm focus:outline-none"
            placeholder="Enter system instructions..."
          />
        </div>
      )}
    </div>
  );
}
