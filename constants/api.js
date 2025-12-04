import axios from "axios";

// axios.post(url,data)

const api = axios.create({
  baseURL: "https://express-micro-gateway.vercel.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
