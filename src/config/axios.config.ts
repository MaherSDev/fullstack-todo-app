import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://strapi.mahersdev.com/api",
})

export default axiosInstance;