import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
})

export const getAllStatesData = () => api.get(`/states/`)


const apis = {
    getAllStatesData,
}

export default apis
