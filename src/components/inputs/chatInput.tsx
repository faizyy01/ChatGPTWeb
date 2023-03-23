import React, { useState, type FormEvent } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  isError: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  isLoading,
  isError,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      void onSubmit(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex py-2">
      <textarea
        className={`h-14 w-full whitespace-pre-wrap border border-gray-200 bg-black px-6 py-3 text-gray-300 focus:border-green-500 focus:outline-none ${
          isError ? "border-red-500 placeholder-red-500" : ""
        }`}
        placeholder={`${
          isError ? "Something went wrong." : "Type your message"
        }`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isError}
      />
      <button
        disabled={isLoading}
        type="submit"
        className={`ml-3 border border-gray-200 bg-black px-6 py-3 font-semibold text-white hover:bg-white hover:text-black focus:outline-none ${
          isError ? "cursor-not-allowed bg-red-500" : ""
        }`}
      >
        <PaperAirplaneIcon className="h-6 w-6" />
      </button>
    </form>
  );
};

export default ChatInput;
