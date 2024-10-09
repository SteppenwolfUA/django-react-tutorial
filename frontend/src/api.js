import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // this allows us to import anything specified inside an environment variable file 
    // if we want to have an environment variable loaded in our JavaScript /React code 
    // it needs to start with VITE
    // the idea here is that we're going to have this in an environment variable
    // that it's really easy for us to load and change what the URL should be
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api