import { Listbox } from "@headlessui/react";
import { useEffect, useState } from "react";
import { getDefaultModel, setDefaultModel } from "~/lib/models/getModels";

export const ModelSelector = () => {
  const [defaultModel, setDefaultModelState] = useState<string>(
    getDefaultModel()
  );
  useEffect(() => {
    setDefaultModel(defaultModel);
  }, [defaultModel]);

  return (
    <div className="">
      {/* <span className="text-white">Default model:</span> */}
      <Listbox value={defaultModel} onChange={setDefaultModelState}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-800 py-2 pl-4 pr-4 text-left focus:outline-none sm:text-sm">
            <span className="block truncate px-1 text-left text-white">
              {defaultModel}
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md  bg-gray-800 py-1 shadow-lg focus:outline-none sm:text-sm">
            <Listbox.Option
              key="gpt-3.5-turbo"
              value="gpt-3.5-turbo"
              className={({ active }) =>
                `${
                  active ? "bg-gray-400 text-black" : "text-white"
                } relative cursor-default select-none py-2 pl-4 pr-4 text-left`
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
                } relative cursor-default select-none py-2 pl-4 pr-4 text-left`
              }
            >
              GPT-4 - $0.03 / 1K tokens
            </Listbox.Option>
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};
