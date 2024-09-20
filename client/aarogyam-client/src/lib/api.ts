import Axios from "axios";

const api = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/main_service/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
