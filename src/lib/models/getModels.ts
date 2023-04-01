export const getDefaultModel = (): string => {
  return localStorage.getItem("defaultModel") || "gpt-3.5-turbo";
};

export const setDefaultModel = (model: string): void => {
  localStorage.setItem("defaultModel", model);
};
