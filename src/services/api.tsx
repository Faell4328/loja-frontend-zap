import axios from 'axios';

const api = axios.create({
    baseURL: window.location.origin+'/public'
})

export default api;