import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
})

export const getStateSummaryJson = async (stateType) => {
    return api.get(`/state/${stateType}`)
        .then(response => response.data)
        .catch(err => {
            return null;
        });
}

export const getStateGeojson = async (planType, stateType) => {
    return api.get(`/plan/plan`,
        {
            params: {
                state: stateType,
                plan: planType,
            }
        })
        .then(response => response.data)
        .catch(err => {
            return null;
        });
}

const apis = {
    getStateSummaryJson,
    getStateGeojson,
}

export default apis