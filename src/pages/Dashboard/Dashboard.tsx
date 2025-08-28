import React, { useState, useEffect } from 'react'
import DashboardForm from '../../component/features/dashboard/DashboardForm'
import styled from 'styled-components'
import {instance} from '../../service/instance'
import { getAnalytics } from '../../service/dashboard'

const Dashboard: React.FC = () => {


    const [groups, setGroups] = useState<{_id: string, name: string}[]>([])
    const [selectedGroup, setSelectedGroup] = useState<string>('')
    const [selectedGroupId, setSelectedGroupId] = useState<string>('')
    const [chartData, setChartData] = useState<any>({});

    useEffect(() => {
        const getGroups = async () => {
            try{
                const res = await instance.get('/dashboard/groups')
                setGroups(res.data)
                setSelectedGroup(res.data[0].name)
                setSelectedGroupId(res.data[0]._id)
            }catch(error){
                console.log(error)
            }
        }
        getGroups()
    }, [])

    useEffect(() => {
        if (!selectedGroupId) return

        const getChartData = async () => {
            try{
                const res = await getAnalytics(selectedGroupId);
                console.log(res)
                setChartData(res)
            }catch(err){
                console.error(err)
            }
        }
        getChartData()
    },[selectedGroupId])

    return(
        <Container>
            <DashboardForm
                dropdownList={groups}
                dropdownValue={selectedGroup}
                setDropdownValue={setSelectedGroup}
                selectedGroupId={selectedGroupId}
                chartData={chartData}
            />
        </Container>
    )
}

export default Dashboard

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`