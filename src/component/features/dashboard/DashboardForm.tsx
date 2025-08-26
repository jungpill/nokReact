import React, {useState} from 'react'
import styled from 'styled-components'
import Dropdown from '../../common/Dropdown'
import { color } from '../../../style/color'
import LabelWithHelp from '../../common/LabelWithHelp'
import SolutionChart from '../../dashboard/SolutionChart'
import ForceGraph from '../../dashboard/NetworkGraph'
import Calendar from '../../dashboard/Calendar'

interface Props{
    dropdownList: string[]
    dropdownValue: string
    setDropdownValue: (value: string) => void
}

const DashboardForm: React.FC<Props> = ({dropdownList, dropdownValue, setDropdownValue}) => {

    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)
    
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
                    options={dropdownList}
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
                        <SolutionChart />
                    </RightWrapper>
                </Row>

                <Row>
                    <LeftWrapper>
                        asdasdasdas
                    </LeftWrapper>
                    <RightWrapper>  
                        <LabelWithHelp label="소통 현황" content="대시보드 이름을 입력해주세요." />
                        <Calendar/>
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
`

const LeftWrapper = styled.div`
    display: flex;
    width: 55%;
    max-height: 700px;
    border: 1px solid #EAEAEA;
    border-radius: 15px;
    flex-direction: column;
    padding: 24px;
`

const RightWrapper = styled.div`
    display: flex;
    width: 40%;
    max-height: 700px;
    border: 1px solid #EAEAEA;
    border-radius: 15px;
    flex-direction: column;
    padding: 24px;
`