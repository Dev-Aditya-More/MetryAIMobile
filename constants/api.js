import axios from "axios";

// axios.post(url,data)

const api = axios.create({
  baseURL: "https://unfetching-beulah-semiadhesive.ngrok-free.dev/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
