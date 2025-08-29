import axios from 'axios'


export const instance = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 2000,
})
