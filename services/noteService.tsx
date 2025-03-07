import { ID, Query } from "react-native-appwrite";
import databaseService from "./databaseService";

// Appwrite database and collection id
const dbId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

console.log("goel ", { dbId, colId });
const noteService = {
  // Get Notes
  async getNotes(userId: string) {
    if (!userId) {
      console.error("Error: Missing userId in getNotes()");
      return {
        data: [],
        error: "User ID is missing",
      };
    }

    try {
      const response = await databaseService?.getDocuments(dbId!, colId!, [
        Query.equal("user_Id", userId),
      ]);
      return response;
    } catch (error: any) {
      console.log("Error fetching notes:", error?.message);
      return { data: [], error: error?.message };
    }
  },

  // add new note
  async addNote(user_Id: string, text: string) {
    try {
      if (!text) {
        return { data: null, error: "Note text is required" };
      }

      const data = {
        text,
        createdAt: new Date()?.toISOString(),
        user_Id,
      };

      const response = await databaseService?.createDocument(
        dbId,
        colId,
        data,
        ID.unique() // will generate a new unique Id
      );

      if (response?.error) {
        return { error: response.error };
      }

      return { data: response };
    } catch (err) {
      console.log({ err });
    }
  },

  // Update Note
  async updateNote(id: string, text: string) {
    const response = await databaseService.updateDocument(dbId, colId, id, {
      text,
    });

    if (response?.error) {
      return { error: response.error };
    }

    return { data: response };
  },

  // Delete Note
  async deleteNote(id: string) {
    const response = await databaseService.deleteDocument(dbId, colId, id);
    if (response?.error) {
      return { error: response.error };
    }

    return { success: true };
  },
};

export default noteService;
