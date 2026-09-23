import axios from 'axios'
// The API is public, read-only data with no auth or cookies, and the server's
// CORS config intentionally does not allow credentials. Sending credentialed
// requests makes the browser block every cross-origin response in local dev
// (client on :3000 -> server on :8090), so credentials mode must stay off.
axios.defaults.withCredentials = false;


const api = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
})

export const getStateSummaryJson = async (stateType) => {
    return api.get(`/summary`,
          {
              params: {
                state: stateType,
              }
          })
        .then(response => response.data)
        .catch(err => {
            return null;
        });
}

export const getStateGeojson = async (planType, stateType) => {
    return api.get(`/plan`,
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