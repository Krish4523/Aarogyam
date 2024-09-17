"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";

// Define the type for the ChatHistory props
interface ChatHistoryProps {
  chatList: string[];
  toggleMenu: () => void;
  showMenu: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatList,
  toggleMenu,
  showMenu,
}) => (
  <div className="flex-3 flex flex-col p-5 mt-3 bg-white overflow-y-auto w-full md:w-2/6">
    <div className="text-lg font-bold mb-3">Recent Chat</div>
    <div className="p-3 border-b border-gray-300 rounded-lg bg-gray-200 relative mb-4">
      {chatList[0]}
      <span
        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={toggleMenu}
      >
        &#x22EE;
      </span>
      {showMenu && (
        <div className="absolute right-2 top-10 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="p-3 cursor-pointer border-b border-gray-300">
            Share
          </div>
          <div className="p-3 cursor-pointer border-b border-gray-300">
            Rename
          </div>
          <div className="p-3 cursor-pointer rounded-b-lg">Delete</div>
        </div>
      )}
    </div>
    <div className="text-lg font-bold mt-10 mb-3">Chat History</div>
    <ul className="list-none p-0 m-0">
      {chatList.slice(1).map((name, index) => (
        <li
          key={index}
          className="p-3 border-b border-gray-300 cursor-pointer rounded-lg relative hover:bg-gray-200"
        >
          {name}
        </li>
      ))}
    </ul>
  </div>
);

export default function Chat() {
  const [messages, setMessages] = useState<
    {
      text: string;
      sentByUser: boolean;
    }[]
  >([]);
  const [input, setInput] = useState<string>("");
  const [chatList] = useState<string[]>([
    "Conversation with Alice",
    "Conversation with Bob",
    "Conversation with Charlie",
    "Conversation with David",
    "Conversation with Eve",
  ]);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sentByUser: true }]);
      setInput("");

      // Simulate a response message after 1 second
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "This is a response", sentByUser: false },
        ]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action of the Enter key
      sendMessage();
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="flex h-screen bg-gray-200 font-sans">
      <div className="flex-7 flex flex-col p-5 bg-white border-r border-gray-300 w-full md:w-4/6">
        <div className="text-xl font-bold py-3 border-b border-gray-300">
          Chat
        </div>
        <div className="flex-1 p-3 mb-3 overflow-y-auto bg-gray-100 rounded-lg border border-gray-300">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col">
              <div
                className={`${
                  message.sentByUser
                    ? "self-end bg-blue-600 text-white"
                    : "self-start bg-gray-200 text-black"
                } p-3 rounded-lg mb-3 max-w-[75%]`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex border-t border-gray-300 pt-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={handleKeyDown} // Handle Enter key press
            className="flex-1 p-3 rounded-md border border-gray-300 mr-3 outline-none"
          />
          <button
            onClick={sendMessage}
            className="py-3 px-5 rounded-md bg-blue-600 text-white border-none cursor-pointer hidden md:flex"
          >
            Send
          </button>
          <button
            onClick={sendMessage}
            className="p-3 rounded-full bg-blue-600 text-white border-none cursor-pointer flex md:hidden"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
      <ChatHistory
        chatList={chatList}
        toggleMenu={toggleMenu}
        showMenu={showMenu}
      />
    </div>
  );
}
