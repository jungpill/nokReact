import {instance} from './instance'

export const getGroupList = async () => {
    try{
        const res = await instance.get('/dashboard/groups')
        return res.data
    }catch(error){
        console.log(error)
    }
}

export const getStudentList = async (groupId: string) => {
    if (!groupId) return;
    try{
        const res = await instance.get('/dashboard/groups/students', {
            params: {
                group_id: groupId,
            }
        })
        return res.data
    }catch(error){
        console.log(error)
    }
}

export const getCommunicationStatus = async (student_id: string) => {
    try{
        console.log(student_id)
        const res = await instance.get(`/dashboard/board-usage`,
            {
                params: {student_id: student_id}
            }
        )
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

//노트 사용량 
export const getNoteUsage = async(student_id: string) => {
    try{
        const res = await instance.get('dashboard/note-usage',{
            params: { student_id: student_id }
        })
        console.log('노트 사용량: ',res.data)
        return res.data
    }catch(error){
        console.error(error)
        return error
    }
}

export const getSolutionUsage = async(studentId: string) => {
    try{
        const res = await instance.get('dashboard/solution-usage',{
            params: { student_id: studentId }
        })
        console.log('솔루션 사용량: ',res.data)
        return res.data
    }catch(error){
        console.error(error)
    }
}

export const getWorldCloud = async(student_id: string) => {
    try{
        const res = await instance.get('dashboard/search-word',
            {params: {
                student_id: student_id
            }}
        )
        return res.data
    }catch(error){
        console.error(error)
    }
}

export const test = async() => {
    try{
        const res = await instance.post('/dashboard/careers/career-activity',{
                search_query: '소방관',
                sess:"d8ae5b2580d448c198851cdcefb2aea5"
        })
        console.log('test: ',res.data)
        return res.data
    }catch(error){
        console.error(error)
    }
}