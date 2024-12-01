import ChatbotModal from "@/components/ChatbotModal";
import ChatInterface from "../components/ChatInterface";

export default function Home() {
  return (
    <main className="h-screen bg-[#f9f7f7]">
      <h1>Chat with StreamChat</h1>
      {/* <ChatInterface /> */}
      <ChatbotModal/>
    </main>
  );
}
