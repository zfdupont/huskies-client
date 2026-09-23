import axios from 'axios'

// Backend serves read-only public data with no auth or cookies (see the server's
// CORS config), so requests are non-credentialed. Sending credentials would make
// the browser require `Access-Control-Allow-Credentials: true`, which the server
// intentionally does not set — that mismatch is what triggers CORS failures.

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