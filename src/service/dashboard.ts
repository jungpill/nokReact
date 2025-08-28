import {instance} from './instance'


export const getCommunicationStatus = async (group_id: string) => {
    try{
        const res = await instance.get(`/dashboard/communication_status/${group_id}`)
        return res.data
    }catch(error){
        console.log(error)
    }
}

export const getTopSearchKeywords = async (group_id: string) => {
    try{
        const res = await instance.get(`dashboard/top_searches/${group_id}`)
        return res.data
    }catch(error){
        console.log(error)
    }
}

export const getAnalytics = async (group_id: string) => {
    try{
        const res = await instance.get(`dashboard/usage_analytics/${group_id}`)
        return res.data
    }catch(error){
        console.log(error)
    }
}