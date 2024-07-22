import axios from 'axios'
axios.defaults.withCredentials = true;


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
    console.log(import.meta.env);
    console.log(api.getUri())
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