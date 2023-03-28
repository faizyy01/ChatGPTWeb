import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { type chat } from "@prisma/client";
import { useSession } from "next-auth/react";
import SettingsModal from "./Settings";
interface Page {
  chats: chat[];
}

interface SidebarProps {
  pages: Page[];
  onChatChange: (chat: chat | null) => void;
  currentChat: chat | null;
  isLoading: boolean;
  isGptLoading: boolean;
  loadMoreChats: () => Promise<void>;
  isFetchingNextPage: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  pages,
  onChatChange,
  isLoading,
  currentChat,
  isGptLoading,
  loadMoreChats,
  isFetchingNextPage,
}) => {
  const { data } = useSession();
  const handleChatChange = (chat: chat | null) => {
    if (!isGptLoading) onChatChange(chat);
  };

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const handleSettingsButtonClick = () => {
    setIsSettingsModalOpen(true);
  };
  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const renderChatItem = (chat: chat) => (
    <li
      key={chat.id}
      className={`mt-2 cursor-pointer border border-gray-900 py-3 px-6 text-gray-400 hover:border hover:border-gray-700 ${
        chat.id === currentChat?.id ? "border border-green-500" : ""
      }`}
      onClick={
        chat.id !== currentChat?.id
          ? () => void handleChatChange(chat)
          : undefined
      }
    >
      {chat.name}
    </li>
  );

  return (
    <>
      <SettingsModal
        isSettingsModalOpen={isSettingsModalOpen}
        closeSettingsModal={closeSettingsModal}
      />
      <aside className=" hidden h-full w-64 items-start border-r border-gray-900 p-3 md:flex md:flex-col">
        <button
          className="w-full border  border-gray-900 py-3 px-6 text-left font-semibold text-gray-300"
          onClick={() => void handleChatChange(null)}
        >
          <PlusIcon className="mr-1 inline-block h-6 w-6 text-gray-300/90" />
          New Chat
        </button>
        <ul
          className="mt-3 w-full flex-1 overflow-y-auto"
          onScroll={(e: React.UIEvent<HTMLUListElement>) => {
            if (!isFetchingNextPage) {
              const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
              if (scrollTop + clientHeight >= scrollHeight - 200) {
                void loadMoreChats();
              }
            }
          }}
        >
          {pages.map((page) => page.chats.map((chat) => renderChatItem(chat)))}
          {isFetchingNextPage && (
            <div className="h-2 w-full bg-gray-900">
              <div className="h-2 animate-pulse bg-green-500"></div>
            </div>
          )}

          {isLoading && (
            <li className="py-3 px-6 text-gray-300">
              <div className="flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border border-t-2 border-green-700"></div>
              </div>
            </li>
          )}
        </ul>
        <div className="px-1">
          <p className="text-left text-xs text-gray-300">
            <span className="text-gray-300/90">
              Welcome, {data?.user.name} 👋
            </span>
          </p>
        </div>
        <button
          className="mt-3 w-full border  border-gray-900 py-3 px-6 text-left font-semibold text-gray-300"
          onClick={handleSettingsButtonClick}
        >
          Settings
        </button>
        <button
          className="mt-3 w-full border  border-gray-900 py-3 px-6 text-left font-semibold text-gray-300"
          onClick={() => {
            void signOut();
          }}
        >
          Sign Out
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
