import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
})

export const getAllStatesData = (stateType) => api.get(`/states/${stateType}`).then(res => {
    return res.data;
}).catch(err => {
    return null;
});


const apis = {
    getAllStatesData,
}

export default apis