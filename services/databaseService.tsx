import { database } from "./appwrite";

const databaseService = {
  // list documents
  async getDocuments(dbId: string, colId: string, queries: any[] = []) {
    console.log("sauvik ", { dbId, colId });
    try {
      const response = await database.listDocuments(dbId, colId, queries);
      return { data: response?.documents || [], error: null };
    } catch (error: any) {
      console.error("Error fetching documents:", error.message);
      return { error: error.message };
    }
  },
};

export default databaseService;
