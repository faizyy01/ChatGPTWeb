import React from "react";
import { type messages, Role } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import { getDefaultModel } from "~/lib/models/getModels";
import { toast } from "react-hot-toast";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
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
  const model = getDefaultModel();
  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
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
      <div className="mx-auto w-full md:w-5/6">
        <ul className="space-y-4">
          <li className="">
            <div className="items-left flex justify-center">
              <p className="text-green-500">Model: {model}</p>
            </div>
          </li>
          {messages.map((message, index) => (
            <li
              key={index}
              className={`flex w-full list-none items-start justify-start`}
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
                className={`w-full border px-6 py-3  ${
                  message.role === Role.user
                    ? "border-gray-700"
                    : "border-green-700"
                }`}
              >
                <p
                  className={`whitespace-pre-wrap leading-relaxed  ${
                    message.role === Role.user
                      ? "text-left text-gray-400/90"
                      : "text-left text-gray-300"
                  }`}
                >
                  {parseAndRenderCode(
                    message.content.trimStart(),
                    copyToClipboard
                  )}
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
      </div>
    );
};

const parseAndRenderCode = (
  content: string,
  copyToClipboard: (text: string) => void
) => {
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
      const codeLines = code?.split("\n").slice(1).join("\n");
      result.push(
        <React.Fragment key={`code_${match.index}`}>
          <div className="relative flex items-center justify-between rounded-t-md bg-gray-800 px-4 py-2 font-sans text-xs text-gray-200">
            <span>{code?.split("\n")[0]}</span>
            <button
              className="ml-auto flex gap-2"
              onClick={() => copyToClipboard(codeLines)}
            >
              <ClipboardDocumentCheckIcon className="h-4 w-4 text-gray-400 hover:text-gray-500" />
              Copy code
            </button>
          </div>
          {/* <button onClick={() => copyToClipboard(code)}>
            <ClipboardDocumentCheckIcon className="h-6 w-6 text-gray-400 hover:text-gray-500" />
          </button> */}
          <ReactMarkdown className="overflow-x-auto p-4">
            {`\`\`\`${code}\`\`\``}
          </ReactMarkdown>
        </React.Fragment>
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
