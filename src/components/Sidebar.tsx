import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { type chat } from "@prisma/client";

interface SidebarProps {
  chats: chat[];
  onChatChange: (chat: chat) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, onChatChange }) => {
  return (
    <div className="relative hidden h-full w-64 border-r border-gray-700 md:block">
      <div className="px-4">
        <h2 className="border border-gray-600 py-3 pl-3 text-left font-semibold text-gray-300">
          <PlusIcon className="mr-1 inline-block h-6 w-6 text-gray-300/90" />
          New Chat
        </h2>
        <div className="overflow-y-auto pt-4">
          <ul className="space-y-2">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className="cursor-pointer py-3 px-6 text-gray-300 hover:border hover:border-gray-700"
                onClick={() => void onChatChange(chat)}
              >
                {chat.name}
              </li>
            ))}
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
