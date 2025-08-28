import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Dropdown from '../../common/Dropdown'
import { color } from '../../../style/color'
import LabelWithHelp from '../../common/LabelWithHelp'
import SolutionChart from '../../dashboard/SolutionChart'
import ForceGraph from '../../dashboard/NetworkGraph'
import Calendar from '../../dashboard/Calendar'
import PieChart from '../../dashboard/PieChart'

interface Props{
    dropdownList: {name: string, _id: string}[]
    dropdownValue: string
    setDropdownValue: (item: string) => void
    selectedGroupId: string;
    chartData: any;
}

const DashboardForm: React.FC<Props> = ({chartData,dropdownList, dropdownValue, setDropdownValue, selectedGroupId}) => {

    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)
    const [groupNameList, setGroupNameList] = useState<string[]>([])

    const sampleData = [
        { name: "A", count: 60 },
        { name: "B", count: 30 },
        { name: "C", count: 10 },
        { name: "D", count: 5 },
        { name: "E", count: 4 },
        { name: "F", count: 3 },
        { name: "G", count: 2 },
        { name: "H", count: 2 },
        { name: "I", count: 2 },
        { name: "J", count: 2 },
    ];

    useEffect(() => {
        for(let i of dropdownList){
            setGroupNameList(prev => [...prev, i.name])
        }
    }, [dropdownList])
    
    return(
        <Container>
            <Header>
                <Title>
                    대시보드
                </Title>
                <SubTitle>
                    학생의 데이터 및 사용량을 확인할 수 있는 대시보드입니다.
                </SubTitle>
            </Header>

            <Body>
                <Dropdown
                    options={groupNameList}
                    value={dropdownValue}
                    onChange={setDropdownValue}
                    isDropdownActive={isDropdownActive}
                    setIsDropdownActive={setIsDropdownActive}
                />

                <Row>
                    <LeftWrapper>
                        <LabelWithHelp label="대시보드 이름" content="대시보드 이름을 입력해주세요." />
                        <ForceGraph/>
                    </LeftWrapper>
                    <RightWrapper>
                        <LabelWithHelp label="대시보드 이름" content="대시보드 이름을 입력해주세요." />
                        <SolutionChart chartData={chartData}/>
                    </RightWrapper>
                </Row>

                <Row>
                    <LeftWrapper style={{height: '400px'}}>
                        <LabelWithHelp label="학생 현황" content="대시보드 이름을 입력해주세요." />
                        <PieChart selectedGroupId={selectedGroupId}/>
                    </LeftWrapper>
                    <RightWrapper style={{height: '400px'}}>  
                        <LabelWithHelp label="소통 현황" content="대시보드 이름을 입력해주세요." />
                        <Calendar selectedGroupId={selectedGroupId}/>
                    </RightWrapper>
                </Row>
            </Body>
        </Container>
    )
}

export default DashboardForm

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`

const Header = styled.div`
    gap: 0.75rem;
`

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 700;
`

const SubTitle = styled.h2`
    font-size: 1.2rem;
    font-weight: 400;
`

const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    border-radius: 20px;
    background-color: ${color.white};
    height: 100%;
    width: 100%;
`

const Row = styled.div`
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
`

const LeftWrapper = styled.div`
    display: flex;
    width: 55%;
    height: 500px;
    border: 2px solid #EAEAEA;
    border-radius: 15px;
    flex-direction: column;
    padding: 24px;
    justify-content: center;
    align-items: center;
`

const RightWrapper = styled.div`
    display: flex;
    width: 40%;
    height: 500px;
    border: 2px solid #EAEAEA;
    border-radius: 15px;
    flex-direction: column;
    padding: 24px;
    justify-content: center;
    align-items: center;
`