import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || "67b0e7c7001d59bd426a",
  url: import.meta.env.VITE_APPWRITE_URL || "https://cloud.appwrite.io/v1",
  databaseId:
    import.meta.env.VITE_APPWRITE_DATABASE_ID || "67d404770027c4b2c27e",
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID || "67d40410001e71d98f78",
  userCollectionId:
    import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID || "67d495340031dc3c6b21",
  postCollectionId:
    import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID || "67d48473002d70939676",
  savesCollectionId:
    import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID || "67d49571002d15df2fcd",
};

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67b0e7c7001d59bd426a");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
