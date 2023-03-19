import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { type chat } from "@prisma/client";

interface SidebarProps {
  chats: chat[];
  onChatChange: (chat: chat | null) => void;
  currentChat: chat | null;
  isloading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  onChatChange,
  isloading,
  currentChat,
}) => {
  return (
    <div className="relative hidden h-full w-64 border-r border-gray-700 md:block">
      <div className="px-4">
        <button
          className="w-full border border-gray-600 py-3 px-6 text-left font-semibold text-gray-300"
          onClick={() => void onChatChange(null)}
        >
          <PlusIcon className="mr-1 inline-block h-6 w-6 text-gray-300/90" />
          New Chat
        </button>
        <div className="overflow-y-auto pt-4">
          <ul className="space-y-2">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={`cursor-pointer py-3 px-6 text-gray-300 hover:border hover:border-gray-700 ${
                  chat.id === currentChat?.id ? "border border-green-500" : ""
                }`}
                onClick={() => void onChatChange(chat)}
              >
                {chat.name}
              </li>
            ))}
            {isloading && (
              <li className="py-3 px-6 text-gray-300">
                <div className="flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border border-t-2 border-green-700"></div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="absolute bottom-0 w-full px-4">
        <button
          className="w-full border border-gray-600 py-3 px-6 text-left font-semibold text-gray-300"
          onClick={() => {
            void signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
