import { Platform } from "react-native";
import { Client, Databases, Account } from "react-native-appwrite";

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  db: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  col: {
    notes: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
  },
};

const client = new Client()
  .setEndpoint(config?.endpoint!)
  .setProject(config?.projectId!);

switch (Platform.OS) {
  case "ios": {
    client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID!);
    break;
  }

  case "android": {
    client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME!);
    break;
  }
}

// for database
const database = new Databases(client);

// for auth
const account = new Account(client);

export { database, client, config, account };
