import React, { useState } from 'react'
import DashboardForm from '../../component/features/dashboard/DashboardForm'
import styled from 'styled-components'

const Dashboard: React.FC = () => {


    const dropdownList = ['1학년 1반', '1학년 2반', '1학년 3반', '1학년 4반', '1학년 5반']
    const [dropdownValue, setDropdownValue] = useState(dropdownList[0])
    
    return(
        <Container>
            <DashboardForm
                dropdownList={dropdownList}
                dropdownValue={dropdownValue}
                setDropdownValue={setDropdownValue}
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