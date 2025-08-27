import {instance} from './instance'


export const getCommunicationStatus = async (group_id: string) => {
    try{
        const res = await instance.get(`/dashboard/communication_status/${group_id}`)
        console.log(res.data)
        return res.data
    }catch(error){
        console.log(error)
    }
}
