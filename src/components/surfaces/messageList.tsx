import React from "react";
import { type messages, Role } from "@prisma/client";
// interface Message {
//   isUser: boolean;
//   text: string;
// }

interface Messages {
  role: Role;
  content: string;
}

interface MessageListProps {
  messages: Messages[] | null;
  isTyping: boolean;
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  isTyping,
}) => {
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border border-t-4 border-green-700"></div>
      </div>
    );
  else if (!messages || messages.length === 0) {
    return (
      <>
        <div className="flex h-full flex-col items-center justify-center">
          <span className="mb-4 text-4xl">👋</span>
          <p className="text-gray-500">Start a conversation!</p>
        </div>
      </>
    );
  } else
    return (
      <ul className="space-y-4">
        {messages.map((message, index) => (
          <li
            key={index}
            className={`flex items-start ${
              message.role === Role.user ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`w-full border px-6 py-3 ${
                message.role === Role.user
                  ? "border-gray-700"
                  : "border-green-700"
              }`}
            >
              <p
                className={`leading-relaxed ${
                  message.role === Role.user
                    ? "text-right text-gray-300/90"
                    : "text-left text-green-500"
                }`}
              >
                {message.content}
              </p>
            </div>
          </li>
        ))}
        {isTyping && (
          <li className="flex items-start justify-end">
            <div className="w-full border border-green-700 px-6 py-3">
              <div className="justify-left flex animate-pulse items-center">
                <span className="text-green-500">...</span>
              </div>
            </div>
          </li>
        )}
      </ul>
    );
};

export default MessageList;
