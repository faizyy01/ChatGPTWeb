import React, { useState, type FormEvent } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex py-2">
      <textarea
        className="h-14 w-full border border-gray-200 bg-black px-6 py-3 text-gray-300 focus:border-green-500 focus:outline-none"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        disabled={isLoading}
        type="submit"
        className="ml-3 border border-gray-200 bg-black px-6 py-3 font-semibold text-white hover:bg-white hover:text-black focus:outline-none"
      >
        <PaperAirplaneIcon className="h-6 w-6" />
      </button>
    </form>
  );
};

export default ChatInput;
