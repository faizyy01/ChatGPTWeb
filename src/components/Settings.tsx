import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Listbox } from "@headlessui/react";
import { getDefaultModel, setDefaultModel } from "~/lib/models/getModels";

interface SettingsProps {
  isSettingsModalOpen: boolean;
  closeSettingsModal: () => void;
}

const SettingsModal: React.FC<SettingsProps> = ({
  isSettingsModalOpen,
  closeSettingsModal,
}) => {
  const [defaultModel, setDefaultModelState] = useState<string>(
    getDefaultModel()
  );

  useEffect(() => {
    setDefaultModel(defaultModel);
  }, [defaultModel]);

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
        <div className="">
          <span className="text-white">Default model:</span>
          <Listbox value={defaultModel} onChange={setDefaultModelState}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-800 py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
                <span className="block truncate text-white">
                  {defaultModel}
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 shadow-lg focus:outline-none sm:text-sm">
                <Listbox.Option
                  key="gpt-3.5-turbo"
                  value="gpt-3.5-turbo"
                  className={({ active }) =>
                    `${
                      active ? "bg-gray-400 text-black" : "text-white"
                    } relative cursor-default select-none py-2 pl-10 pr-4`
                  }
                >
                  GPT-3.5-turbo - $0.002 / 1K tokens
                </Listbox.Option>
                <Listbox.Option
                  key="gpt-4"
                  value="gpt-4"
                  className={({ active }) =>
                    `${
                      active ? "bg-gray-400 text-black" : "text-white"
                    } relative cursor-default select-none py-2 pl-10 pr-4`
                  }
                >
                  GPT-4 - $0.03 / 1K tokens
                </Listbox.Option>
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        {/* <div className="mt-4 text-white">
          <p>Total cost:</p>
          <p>Total tokens used:</p>
        </div> */}
        {/* Add more settings here */}
      </div>
    </div>
  );
};

export default SettingsModal;
