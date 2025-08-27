import axios from 'axios'


export const instance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 2000,
})
