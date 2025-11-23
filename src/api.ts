import axios from "axios";
import type { Workplace } from "./types";

const api = axios.create({
  // baseURL: "http://localhost:8000/api/", // for express server
  baseURL: "http://127.0.0.1:8000/api/", // for django server
});

export const getWorkplaces = () =>
  api.get<Workplace[]>("workplaces/").then((r) => r.data);

export const createWorkplace = (data: Omit<Workplace, "id">) =>
  api.post("workplaces/", data);

export const updateWorkplace = (id: string, data: Omit<Workplace, "id">) =>
  api.put(`workplaces/${id}/`, data);

export const deleteWorkplace = (id: string) => api.delete(`workplaces/${id}/`);
