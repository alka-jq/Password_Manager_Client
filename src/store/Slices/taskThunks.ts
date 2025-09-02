import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Task } from "./taskSlice";

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

interface AddTaskPayload {
  title: string;
  email: string;
  username: string;
  password: string;
  totp?: string;
  websites: string[];
  note: string;
  attachments: File[];
  cell_id: string;
  vaultKey?: string;
  vaultName?: string;
  vaultIcon?: string;
  vaultColor?: string;
}export const addTaskAsync = createAsyncThunk<Task, AddTaskPayload>(
  "task/addTaskAsync",
  async (formData, { rejectWithValue }) => {
    try {
      const apiUrl = `${baseUrl}/login-credentials/add`;
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found");
        return rejectWithValue("Unauthorized: No token");
      }

      const payload = new FormData();
      payload.append("title", formData.title);
      if (formData.email) payload.append("email", formData.email);
      if (formData.username) payload.append("username", formData.username);
      payload.append("password", formData.password);
      if (formData.totp) payload.append("two_factor_secret", formData.totp);
      payload.append("websites", formData.websites.join(","));
      payload.append("notes", formData.note);
      payload.append("cell_id", formData.cell_id);

      formData.attachments.forEach((file) => {
        payload.append("attachment", file);
      });

      // Debug log
      for (let [key, value] of payload.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("API call failed:", error);
      return rejectWithValue(error.response?.data || error.message || "Something went wrong");
    }
  }
);


// export const addTaskAsync = createAsyncThunk<Task, AddTaskPayload>(
//   "task/addTaskAsync",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const apiUrl = `${baseUrl}/login-credentials/add`;
//       const token = localStorage.getItem("token");

//       const payload = new FormData();
//       payload.append("title", formData.title);
//       if (formData.email) payload.append("email", formData.email);
//       if (formData.username) payload.append("username", formData.username);
//       payload.append("password", formData.password);
//       if (formData.totp) payload.append("two_factor_secret", formData.totp);
//       payload.append("websites", formData.websites.join(","));
//       payload.append("notes", formData.note);
//       payload.append("cell_id", formData.cell_id);

//       formData.attachments.forEach((file) => {
//         payload.append("attachment", file);
//       });

//       const response = await axios.post(apiUrl, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       return response.data;
//     } catch (error: any) {
//   console.error("API call failed:", error.response || error);
//   return rejectWithValue(error.response?.data || error.message || "Something went wrong");
// }
//   }
// );
