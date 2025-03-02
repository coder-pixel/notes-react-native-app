import databaseService from "./databaseService";

// Appwrite database and collection id
const dbId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;

console.log("goel ", { dbId, colId });
const noteService = {
  // Get Notes
  async getNotes() {
    // if (!userId) {
    //   console.error("Error: Missing userId in getNotes()");
    //   return {
    //     data: [],
    //     error: "User ID is missing",
    //   };
    // }

    try {
      const response = await databaseService?.getDocuments(dbId!, colId!, [
        // Query.equal("user_id", userId),
      ]);
      return response;
    } catch (error: any) {
      console.log("Error fetching notes:", error?.message);
      return { data: [], error: error?.message };
    }
  },
};

export default noteService;
