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
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  if (!messages) {
    return <></>;
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
      </ul>
    );
};

export default MessageList;
