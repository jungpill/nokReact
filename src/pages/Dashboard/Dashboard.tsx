import React, { useState, useEffect } from 'react'
import DashboardForm from '../../component/features/dashboard/DashboardForm'
import styled from 'styled-components'
import {instance} from '../../service/instance'

const Dashboard: React.FC = () => {


    const [groups, setGroups] = useState<{_id: string, name: string}[]>([])
    const [selectedGroup, setSelectedGroup] = useState<string>('')
    const [selectedGroupId, setSelectedGroupId] = useState<string>('')

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

    return(
        <Container>
            <DashboardForm
                dropdownList={groups}
                dropdownValue={selectedGroup}
                setDropdownValue={setSelectedGroup}
                selectedGroupId={selectedGroupId}
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