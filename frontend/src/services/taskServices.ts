import axios from "axios";
const API_URL = "http://localhost:3000/api/tasks";
const getConfig = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const getTasks = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};
export const createTask = async (title: string, description: string) => {
  const response = await axios.post(
    API_URL,
    {
      title,
      description,
    },
    getConfig(),
  );
  return response.data;
};
export const deleteTask = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig());
  return response.data;
};
export const updateTask = async (
  id: number,
  title: string,
  description: string,
  status: string,
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    { title, description, status },
    getConfig(),
  );
  return response.data;
};
