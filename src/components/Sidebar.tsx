import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { type chat } from "@prisma/client";

interface SidebarProps {
  chats: chat[];
  onChatChange: (chat: chat | null) => void;
  currentChat: chat | null;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  onChatChange,
  isLoading,
  currentChat,
}) => {
  return (
    <aside className=" hidden h-full w-64 items-start border-r border-gray-600 p-3 md:flex md:flex-col">
      <button
        className="w-full border  border-gray-600 py-3 px-6 text-left font-semibold text-gray-300"
        onClick={() => void onChatChange(null)}
      >
        <PlusIcon className="mr-1 inline-block h-6 w-6 text-gray-300/90" />
        New Chat
      </button>
      <ul className="mt-3 w-full flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`mt-2 cursor-pointer border border-gray-700 py-3 px-6 text-gray-300 hover:border hover:border-gray-500 ${
              chat.id === currentChat?.id ? "border border-green-500" : ""
            }`}
            onClick={
              chat.id !== currentChat?.id
                ? () => void onChatChange(chat)
                : undefined
            }
          >
            {chat.name}
          </li>
        ))}
        {isLoading && (
          <li className="py-3 px-6 text-gray-300">
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border border-t-2 border-green-700"></div>
            </div>
          </li>
        )}
      </ul>
      <button
        className="mt-3 w-full border  border-gray-600 py-3 px-6 text-left font-semibold text-gray-300"
        onClick={() => {
          void signOut();
        }}
      >
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
