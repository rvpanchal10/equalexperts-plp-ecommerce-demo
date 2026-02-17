const STORAGE_PREFIX = 'ee-plp';

export const getStorageItem = (key: string) => {
  const item = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
  return item ? JSON.parse(item) : null;
};

export const setStorageItem = (key: string, value: any) => {
  localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
};

export const removeStorageItem = (key: string) => {
  localStorage.removeItem(`${STORAGE_PREFIX}:${key}`);
};