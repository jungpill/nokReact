import React, {useState} from 'react'
import styled from 'styled-components'
import Dropdown from '../../common/Dropdown'
import { color } from '../../../style/color'

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