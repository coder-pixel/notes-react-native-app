import { ID } from "react-native-appwrite";
import { account } from "./appwrite";

const authService = {
  // Register a User
  async register(email: string, password: string) {
    try {
      const response = await account?.create(ID?.unique(), email, password);
      return response;
    } catch (error: any) {
      return {
        error: error?.message || "Registration failed. Please try agian",
      };
    }
  },

  // Login
  async login(email: string, password: string) {
    try {
      const response = await account?.createEmailPasswordSession(
        email,
        password
      );
      return response;
    } catch (error: any) {
      return {
        error: error?.message || "Login failed. Please check your credentials",
      };
    }
  },

  // Get logged in user
  async getUser() {
    try {
      return await account?.get();
    } catch (error: any) {
      return null;
    }
  },

  // Logout user
  async logout() {
    try {
      await account?.deleteSession("current");
    } catch (error: any) {
      return {
        error: error?.message || "Logout failed. Please try again",
      };
    }
  },
};

export default authService;
