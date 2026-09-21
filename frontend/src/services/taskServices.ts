import axios from "axios";
const API_URL = "http://localhost:3000/api/tasks";
export const getTasks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
export const createTask = async (title: string, description: string) => {
  const response = await axios.post(API_URL, {
    title,
    description,
  });
  return response.data;
};
