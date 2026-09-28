import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const AUTH_URL = `${API_URL}/api/auth`;
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${AUTH_URL}/login`, {
    email,
    password,
  });
  return response.data;
};
export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await axios.post(`${AUTH_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
};
