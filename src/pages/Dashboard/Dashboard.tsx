import React, { useState, useEffect } from 'react'
import DashboardForm from '../../component/features/dashboard/DashboardForm'
import styled from 'styled-components'
import {instance} from '../../service/instance'
import { getAnalytics,getTopSearchKeywords } from '../../service/dashboard'

const Dashboard: React.FC = () => {

    const [groups, setGroups] = useState<{_id: string, name: string}[]>([])
    const [selectedGroup, setSelectedGroup] = useState<string>('')
    const [selectedGroupId, setSelectedGroupId] = useState<string>('')
    const [chartData, setChartData] = useState<any>({});
    const [pieChartData, setPieChartData] = useState<any>([]);

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
                setChartData(res)
            }catch(err){
                console.error(err)
            }
        }
        getChartData()
    },[selectedGroupId])

    useEffect(() => {
        if (!selectedGroupId) return

        const fetchData = async () => {
          try{
                const result = await getTopSearchKeywords(selectedGroupId);
            if (result) {
                setPieChartData(result);
            }}catch(err){
                console.log(err)
            }
        };
        fetchData();
      }, [selectedGroupId]);

    return(
        <Container>
            <DashboardForm
                dropdownList={groups}
                dropdownValue={selectedGroup}
                setDropdownValue={setSelectedGroup}
                setSelectedGroupId={setSelectedGroupId}
                selectedGroupId={selectedGroupId}
                chartData={chartData}
                pieChartData={pieChartData}
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