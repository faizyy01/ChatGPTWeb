import React from "react";
import { type messages, Role } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
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
  const session = useSession();
  if (isLoading)
    return (
      <div className="flex h-full flex-col items-center justify-center">
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
        <li className="">
          <div className="flex items-center justify-center">
            <p>Model: Legacy (GPT-3.5)</p>
          </div>
        </li>
        {messages.map((message, index) => (
          <li
            key={index}
            className={`flex items-start ${
              message.role === Role.user ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === Role.user ? (
              <img
                src={
                  session.data?.user.image
                    ? session.data?.user.image
                    : "https://png.pngtree.com/element_our/20190529/ourmid/pngtree-user-icon-image_1187018.jpg"
                }
                alt="Logo"
                className="mr-4 h-6 w-6"
              />
            ) : (
              <img
                src="https://nileswestnews.org/wp-content/uploads/2023/01/chatgptlogo-900x900.png"
                alt="Logo"
                className="mr-4 h-6 w-6"
              />
            )}
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
                    ? "text-left text-gray-300/90"
                    : "text-left text-green-500"
                }`}
              >
                {parseAndRenderCode(message.content)}
              </p>
            </div>
          </li>
        ))}
        {isTyping && (
          <li className="flex items-start justify-end">
            <img
              src="https://nileswestnews.org/wp-content/uploads/2023/01/chatgptlogo-900x900.png"
              alt="Logo"
              className="mr-4 h-6 w-6"
            />
            <div className=" w-full border border-green-700 px-6 py-3">
              <div className="justify-left flex animate-pulse items-center">
                <span className="text-green-500">...</span>
              </div>
            </div>
          </li>
        )}
      </ul>
    );
};

const parseAndRenderCode = (content: string) => {
  const codeBlockRegex = /```([^`]+)```/g;
  let lastIndex = 0;
  const result = [];

  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBeforeCode = content.slice(lastIndex, match.index);
    if (textBeforeCode) {
      result.push(textBeforeCode);
    }

    const code = match[1];
    if (code) {
      result.push(
        <ReactMarkdown
          key={`code_${match.index}`}
        >{`\`\`\`${code}\`\`\``}</ReactMarkdown>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  const textAfterLastCode = content.slice(lastIndex);
  if (textAfterLastCode) {
    result.push(textAfterLastCode);
  }

  return result;
};

export default MessageList;
