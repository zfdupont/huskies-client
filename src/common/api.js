import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
})

function parseJSON(response) {
    return response
        .json()
        .then((data) => ({ status: response.status, body: data }));
}

export const getStateGeoJson = async (planType, stateType) => {
    // TO DO: Add plan Type to the query when server api ready.
    return api.get(`/states/${stateType}`)
        .then(response => response.data)
        .catch(err => {
            return null;
        });
}

const apis = {
    getStateGeoJson,
}

export default apis