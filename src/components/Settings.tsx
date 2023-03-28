import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import { useQuery } from "@tanstack/react-query";

interface SettingsProps {
  isSettingsModalOpen: boolean;
  closeSettingsModal: () => void;
}

const SettingsModal: React.FC<SettingsProps> = ({
  isSettingsModalOpen,
  closeSettingsModal,
}) => {
  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded border bg-black p-6">
        <div className="flex items-start justify-between">
          <h3 className="mb-4 text-xl font-semibold text-white">Settings</h3>
          <button
            className="text-white focus:outline-none"
            onClick={closeSettingsModal}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="text-white">
          <p>Total cost:</p>
          <p>Total tokens used:</p>
        </div>
        {/* Add more settings here */}
      </div>
    </div>
  );
};

export default SettingsModal;
