import { Storage } from '@google-cloud/storage';

// This is a helper function that instantiates Google Cloud Storage
const instantiateStorage = () => {
  const storage = new Storage();

  return storage;
};

const globalForStorage = globalThis as unknown as {
  storage: Storage | undefined;
};

export const storage = globalForStorage.storage ?? instantiateStorage();

if (process.env.NODE_ENV !== 'production') globalForStorage.storage = storage;
