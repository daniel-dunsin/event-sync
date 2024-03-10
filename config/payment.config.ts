import axios from "axios";
import secrets from "../constants/secrets.const";

export const paymentInstance = axios.create({
  baseURL: "https://sandbox-api-d.squadco.com",
  headers: {
    "Content-Type": "application/json",
  },
});

paymentInstance.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${secrets.squad.liveKey}`;

  return req;
});
