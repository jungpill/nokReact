import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Dropdown from '../../common/Dropdown'
import { color } from '../../../style/color'
import LabelWithHelp from '../../common/LabelWithHelp'
import SolutionChart from '../../dashboard/SolutionChart'
import ForceGraph from '../../dashboard/NetworkGraph'
import Calendar from '../../dashboard/Calendar'
import PieChart from '../../dashboard/PieChart'
import CorpusScatter3DFromDict from '../../dashboard/CorpusScatter3D'
import Badge from '../../dashboard/Badge'

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
    const [selectedTab, setSelectedTab] = useState<'데이터 연결망' | '코퍼스 분석'>('데이터 연결망')

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
                        <LabelWithHelp label="대시보드 이름" content={selectedTab === '데이터 연결망' ? '작성된 문서에 대한 Co-occurrence 분석결과 입니다. 단어간 연관도에 따라 연관관계가 표시되어있습니다.' : '검색 키워드를 임베딩하여 벡터공간에 나타낸 결과입니다. 연관도에 따라 서로 밀접하게 위치하고 있습니다.'} width={400} />
                        <div style={{display:'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start', gap: '10px'}}>
                            <Tab isActive={selectedTab==='데이터 연결망'} onClick={() => setSelectedTab('데이터 연결망')}>
                                데이터 연결망
                            </Tab>
                            <Tab isActive={selectedTab==='코퍼스 분석'} onClick={() => setSelectedTab('코퍼스 분석')}>
                                코퍼스 분석
                            </Tab>
                        </div>

                        {selectedTab === '데이터 연결망' ? <ForceGraph/> : <CorpusScatter3DFromDict/>}
                    </LeftWrapper>
                    <RightWrapper>
                        <LabelWithHelp label="솔루션 사용 분석" content="그룹별 학생의 활동량을 제공합니다." width={300}/>
                        <SolutionChart chartData={chartData}/>
                    </RightWrapper>
                </Row>

                <Row>
                    <LeftWrapper style={{height: '400px'}}>
                        <LabelWithHelp label="학생 현황" content="그룹별 가장 많이 검색된 키워드를 보여줍니다." width={350}/>
                        <PieChart selectedGroupId={selectedGroupId}/>
                    </LeftWrapper>
                    <RightWrapper style={{height: '400px'}}>  
                        <div style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            <LabelWithHelp label="소통 현황" content="게시글과 댓글 작성 데이터를 바탕으로 그룹별 소통 현황을 보여줍니다. 소통 수준은 활발(주 4회 이상), 보통(주 2회 이상), 소극(주 2회 미만)으로 구분됩니다." width={470}/>
                            <Badge active={3}/>
                        </div>
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
    width: 65%;
    height: 500px;
    border: 2px solid #EAEAEA;
    border-radius: 15px;
    flex-direction: column;
    padding: 24px;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`

const RightWrapper = styled.div`
    display: flex;
    width: 30%;
    height: 500px;
    border: 2px solid #EAEAEA;
    border-radius: 15px;
    flex-direction: column;
    padding: 24px;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`

const Tab = styled.div<{isActive: boolean}>`
    display: flex;
    width: 130px;
    border-radius: 5px;
    background-color: ${(props) => props.isActive ? '#35B0E6' : 'black'};
    color: white;
    font-size: 12px;
    padding: 5px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`