import { StreamMode } from "@/components/Settings";
import { Message, ToolCall } from "../types";

export const handleStreamEvent = (
  event: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  streamMode: StreamMode
) => {
  if (streamMode === "messages") {
    handleStreamMessageEvent(event, setMessages);
  } else if (streamMode === "events") {
    handleStreamEventEvent(event, setMessages);
  } else if (streamMode === "updates") {
    handleStreamUpdatesEvent(event, setMessages);
  } else if (streamMode === "values") {
    handleStreamValuesEvent(event, setMessages);
  }
};

const handleStreamMessageEvent = (
  event: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  if (event.event === "messages/partial") {
    event.data.forEach((dataItem: any) => {
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        console.log("--------------------------------")
        console.log(dataItem)
        // if (dataItem.type === "ai" && Array.isArray(dataItem.tool_calls)) {
        //   if (lastMessage?.sender === "ai" && lastMessage.toolCalls) {
        //     // Gộp tool_calls mới mà không bị trùng
        //     const mergedToolCalls = [
        //       ...lastMessage.toolCalls,
        //       ...dataItem.tool_calls.filter(
        //         (newTc: ToolCall) =>
        //           !lastMessage.toolCalls!.some((existingTc) => existingTc.id === newTc.id)
        //       ),
        //     ];

        //     return [
        //       ...prevMessages.slice(0, -1),
        //       { ...lastMessage, toolCalls: mergedToolCalls },
        //     ];
        //   }

        //   return [
        //     ...prevMessages,
        //     {
        //       id: dataItem.id,
        //       sender: "ai",
        //       text: "",
        //       toolCalls: dataItem.tool_calls,
        //     },
        //   ];
        // }

        if (dataItem.content) {
          // Cập nhật tin nhắn hiện tại nếu khớp ID
          if (lastMessage?.id === dataItem.id) {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, text: dataItem.content },
            ];
          }

          // Thêm tin nhắn mới nếu không khớp ID
          return [
            ...prevMessages,
            {
              id: dataItem.id,
              sender: "ai",
              text: dataItem.content,
              toolCalls: [],
            },
          ];
        }

        return prevMessages;
      });
    });
  } else if (event.event === "messages/complete") {
  // if (event.event === "messages/complete") {
    const dataItem = event.data[event.data.length - 1];
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];

      if (dataItem.type === "tool") {
        const toolCall: ToolCall = {
          id: dataItem.tool_call_id,
          name: dataItem.name,
          result: dataItem.content,
          args: dataItem.artifact || undefined,
        };

        if (lastMessage?.sender === "ai" && lastMessage.toolCalls) {
          return [
            ...prevMessages.slice(0, -1),
            {
              ...lastMessage,
              toolCalls: lastMessage.toolCalls.map((tc) =>
                tc.id === toolCall.id ? { ...tc, ...toolCall } : tc
              ),
            },
          ];
        }

        return [
          ...prevMessages,
          {
            id: dataItem.id,
            sender: "ai",
            text: "",
            toolCalls: [toolCall],
          },
        ];
      }

      if (dataItem.type === "ai" && dataItem.content) {
        const messageExists = prevMessages.some((msg) => msg.id === dataItem.id);

        if (messageExists) {
          return prevMessages.map((msg) =>
            msg.id === dataItem.id ? { ...msg, text: dataItem.content } : msg
          );
        }

        return [
          ...prevMessages,
          {
            id: dataItem.id,
            sender: "ai",
            text: dataItem.content,
            toolCalls: [],
          },
        ];
      }

      return prevMessages;
    });
  }
};


// const handleStreamMessageEvent = (
//   event: any,
//   setMessages: React.Dispatch<React.SetStateAction<Message[]>>
// ) => {
//   if (event.event === "messages/partial") {
//     event.data.forEach((dataItem: any) => {
//       if (
//         dataItem.type === "ai" &&
//         Array.isArray(dataItem.tool_calls) &&
//         dataItem.tool_calls.length > 0
//       ) {
//         setMessages((prevMessages) => {
//           const lastMessage = prevMessages[prevMessages.length - 1];
//           if (lastMessage && lastMessage.sender === "ai") {
//             // Merge new tool calls with existing ones
//             const mergedToolCalls = [
//               ...(lastMessage.toolCalls || []),
//               ...dataItem.tool_calls.filter(
//                 (newTc: ToolCall) =>
//                   !lastMessage.toolCalls?.some(
//                     (existingTc) => existingTc.id === newTc.id
//                   )
//               ),
//             ].map((tc: ToolCall) => {
//               const updatedTc = dataItem.tool_calls.find(
//                 (newTc: ToolCall) => newTc.id === tc.id
//               );
//               return updatedTc ? { ...tc, ...updatedTc } : tc;
//             });

//             return [
//               ...prevMessages.slice(0, -1),
//               {
//                 ...lastMessage,
//                 toolCalls: mergedToolCalls,
//               },
//             ];
//           } else {
//             // If the last message was not from AI, add a new message
//             return [
//               ...prevMessages,
//               {
//                 text: "",
//                 sender: "ai",
//                 toolCalls: dataItem.tool_calls,
//                 id: dataItem.id,
//               },
//             ];
//           }
//         });
//       } else if (dataItem.content) {
//         setMessages((prevMessages) => {
//           const lastMessage = prevMessages[prevMessages.length - 1];
//           if (lastMessage && dataItem.id === lastMessage.id) {
//             return [
//               ...prevMessages.slice(0, -1),
//               {
//                 ...lastMessage,
//                 text: dataItem.content,
//               },
//             ];
//           } else {
//             return [
//               ...prevMessages,
//               {
//                 text: dataItem.content,
//                 sender: "ai",
//                 toolCalls: [],
//                 id: dataItem.id,
//               },
//             ];
//           }
//         });
//       }
//     });
//   } else if (event.event === "messages/complete") {
//     const dataItem = event.data[event.data.length - 1];
//     if (dataItem.type === "tool") {
//       // Handle tool call completion
//       const toolCall: Partial<ToolCall> = {
//         id: dataItem.tool_call_id,
//         name: dataItem.name,
//         result: dataItem.content,
//       };

//       // Only set args if it's truthy
//       if (dataItem.artifact) {
//         toolCall.args = dataItem.artifact;
//       }

//       setMessages((prevMessages) => {
//         const lastMessage = prevMessages[prevMessages.length - 1];
//         if (lastMessage && lastMessage.sender === "ai") {
//           return [
//             ...prevMessages.slice(0, -1),
//             {
//               ...lastMessage,
//               toolCalls: lastMessage.toolCalls?.map((tc) =>
//                 tc.id === toolCall.id ? { ...tc, ...toolCall } : tc
//               ) || [toolCall as ToolCall],
//             },
//           ];
//         } else {
//           return [
//             ...prevMessages,
//             {
//               text: "",
//               sender: "ai",
//               toolCalls: [toolCall as ToolCall],
//               id: dataItem.id,
//             },
//           ];
//         }
//       });
//     } else if (dataItem.type === "ai" && dataItem.content) {
//       setMessages((prevMessages) => {
//         const messageExists = prevMessages.some(
//           (msg) => msg.id === dataItem.id
//         );
//         // Message already exists, don't add it again
//         if (messageExists) {
//           return prevMessages;
//         }

//         const messageStreamed = prevMessages.find((msg) =>
//           dataItem.content.startsWith(msg.text)
//         );

//         if (messageStreamed) {
//           // Message has already partially been streamed, update it
//           return prevMessages.map((msg) => {
//             if (msg.id === messageStreamed.id) {
//               return { ...messageStreamed, text: dataItem.content };
//             }
//             return msg;
//           });
//         }

//         return [
//           ...prevMessages,
//           { id: dataItem.id, text: dataItem.content, sender: "ai" },
//         ];
//       });
//     }
//   }
// };

const handleStreamEventEvent = (
  event: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  if (event.event !== "events") return;
  const data = event.data;
  setMessages((prevMessages) => {
    return [
      ...prevMessages,
      { rawResponse: data, sender: "ai", id: data.run_id },
    ];
  });
};

const handleStreamUpdatesEvent = (
  event: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  if (event.event !== "updates") {
    // Not an update, return
    return;
  }
  const data = event.data;
  setMessages((prevMessages) => {
    return [
      ...prevMessages,
      { rawResponse: data, sender: "ai", id: data.run_id },
    ];
  });
};

const handleStreamValuesEvent = (
  event: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  if (event.event !== "values") {
    // Not an update, return
    return;
  }
  const data = event.data;
  setMessages((prevMessages) => {
    return [
      ...prevMessages,
      { rawResponse: data, sender: "ai", id: data.run_id },
    ];
  });
};
