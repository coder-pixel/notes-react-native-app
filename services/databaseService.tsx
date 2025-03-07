import { database } from "./appwrite";

const databaseService = {
  // list documents
  async getDocuments(dbId: string, colId: string, queries: any[] = []) {
    try {
      const response = await database.listDocuments(dbId, colId, queries);
      return { data: response?.documents || [], error: null };
    } catch (error: any) {
      console.error("Error fetching documents:", error.message);
      return { error: error.message };
    }
  },

  // Create Documents
  async createDocument(
    dbId: string,
    colId: string,
    data: any,
    id: string | null = null
  ) {
    try {
      return await database.createDocument(dbId, colId, id!, data);
    } catch (error: any) {
      console.error("Error creating document", error.message);
      return {
        error: error?.message,
      };
    }
  },

  // Update Document
  async updateDocument(dbId: string, colId: string, id: string, data: any) {
    try {
      return await database.updateDocument(dbId, colId, id, data);
    } catch (error: any) {
      console.error("Error updating document", error.message);
      return {
        error: error.message,
      };
    }
  },

  // Delete Documemts
  async deleteDocument(dbId: string, colId: string, id: string) {
    try {
      await database?.deleteDocument(dbId, colId, id);

      return { success: true };
    } catch (err: any) {
      console.log("Error deleting document: ", { err });
      return {
        error: err?.message,
      };
    }
  },
};

export default databaseService;
