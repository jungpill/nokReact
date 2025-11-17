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
import solution from '../../../assets/solution.png'
import MonthlyNoteUsageChart from '../../dashboard/NoteUsage'
import note from '../../../assets/note.png'
import wordcloud from '../../../assets/wordCloud.png'

interface Group {
    id: string;
    name: string;
  }
  
  interface Student {
    _id: string;
    student_id: string;
    student_name: string;
  }
  
  interface Props {
    groupList: Group[];
    studentList: Student[];
    selectedGroup: string;
    selectedGroupId: string;
    setSelectedGroup: (name: string) => void;
    setSelectedGroupId: (id: string) => void;
    selectedStudent: string;
    selectedStudentId: string;
    setSelectedStudent: (name: string) => void;
    setSelectedStudentId: (id: string) => void;
    chartData: any;
    pieChartData: any;
    noteUsage: any;
  }

const DashboardForm: React.FC<Props> = ({
    groupList,
    studentList,
    selectedGroup,
    selectedGroupId,
    setSelectedGroup,
    setSelectedGroupId,
    selectedStudent,
    selectedStudentId,
    setSelectedStudent,
    setSelectedStudentId,
    chartData,
    pieChartData,
    noteUsage,
}) => {

    const [isGroupDropdownActive, setIsGroupDropdownActive] = useState<boolean>(false)
    const [isStudentDropdownActive, setIsStudentDropdownActive] = useState<boolean>(false)
    const [groupNameList, setGroupNameList] = useState<string[]>([])
    const [selectedTab, setSelectedTab] = useState<'데이터 연결망' | '코퍼스 분석'>('데이터 연결망')
    const [weekTotal, setWeekTotal] = useState<number>(0)

    const handleWeekTotalChange = (total: number) => {
        setWeekTotal(total)
    }

    useEffect(() => {
        for(let i of groupList){
            setGroupNameList(prev => [...prev, i.name])
        }
    }, [groupList])
    
    const test = {
        "monthly_access_counts": {
            "average_student_access_count": 16,
            "student_access_count": 0
        },
        "monthly_keyword_search_counts": {
            "average_student_keyword_search_count": 26,
            "student_keyword_search_count": 20
        },
        "monthly_note_usage_counts": {
            "average_student_note_usage_count": 19,
            "student_note_usage_count": 19
        }
    }

    const isAllZero = (payload?: { note_usage_data?: Record<string, number | string> }) => {
        const vals = Object.values(payload?.note_usage_data ?? {});
        // 1~12까지 모두 있고 전부 0인지 확인
        return vals.length === 12 && vals.every(v => Number(v) === 0);
      };
    
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
               <div style={{display:'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start', gap: '14px'}}>
               <Dropdown
                    options={groupList}
                    value={selectedGroup}
                    onChange={setSelectedGroup}
                    isDropdownActive={isGroupDropdownActive}
                    setIsDropdownActive={setIsGroupDropdownActive}
                    setSelectedId={setSelectedGroupId}
                    labelKey="name"
                    valueKey="id"
                />

                <Dropdown
                    options={studentList}
                    value={selectedStudent}
                    onChange={setSelectedStudent}
                    isDropdownActive={isStudentDropdownActive}
                    setIsDropdownActive={setIsStudentDropdownActive}
                    setSelectedId={setSelectedStudentId}
                    labelKey="student_name"
                    valueKey="student_id"
                />
               </div>

                <Row>
                <LeftWrapper>
                <LabelWithHelp
                    label="노트 사용량"
                    content={'학생이 노트에 업로드한 글자수를 기반으로 월별 학습 활동량을 시각화합니다.'}
                    width={400}
                />

                {noteUsage && !isAllZero(noteUsage) ? (
                    <MonthlyNoteUsageChart payload={noteUsage} />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <p
                        style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        position: 'absolute',
                        }}
                    >
                        데이터가 존재하지 않습니다.
                    </p>
                    <img src={note} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                )}
                </LeftWrapper>
                    <RightWrapper>
                        {chartData && chartData.monthly_access_counts.average_student_access_count !== 0 &&
                        chartData.monthly_keyword_search_counts.average_student_keyword_search_count !== 0 &&
                        chartData.monthly_note_usage_counts.average_student_note_usage_count !== 0
                        ? (
                            // test데이터 chartData로 수정시 서버 데이터로 변경됨
                            <SolutionChart chartData={test}/>
                        ) : (
                           <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                           <p
                           style={{
                            fontSize:'18px', 
                            fontWeight: '700', 
                            position: 'absolute',
                            }}
                           >
                                데이터가 존재하지 않습니다. 
                           </p>
                            <img src={solution} alt="test" style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                            </div>
                        )}
                    </RightWrapper>
                </Row>

                <Row>
                    <LeftWrapper style={{height: '400px'}}>
                    <LabelWithHelp label="검색 데이터 분석" content="학생이 한달동안 가장 많이 사용하는 단어를 추출해 시각적으로 보여줍니다." width={470}/>
                       {pieChartData ? <img src={pieChartData} style={{width: '100%', height: '100%', objectFit: 'contain'}}/> :
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <p
                           style={{
                            fontSize:'18px', 
                            fontWeight: '700', 
                            position: 'absolute',
                            }}
                           >
                                데이터가 존재하지 않습니다. 
                           </p>
                            <img src={wordcloud} alt="test" style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                        </div>}
                    </LeftWrapper>
                    <RightWrapper style={{height: '400px'}}>  
                        <Text>
                            <LabelWithHelp label="소통 현황" content="게시글과 댓글 작성 데이터를 바탕으로 그룹별 소통 현황을 보여줍니다. 소통 수준은 활발(주 4회 이상), 보통(주 2회 이상), 소극(주 2회 미만)으로 구분됩니다." width={470}/>
                            <Badge active={weekTotal}/>
                        </Text>

                        <div style={{display: 'flex', width: '100%', height: '100%', justifyContent:'center'}}>
                            <Calendar selectedGroupId={selectedGroupId} onWeekTotalChange={handleWeekTotalChange}/>
                        </div>
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
    width: 100%;
    padding: 2rem;
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

    @media(max-width: 1800px){  
        width: 50%;
    }
`

const RightWrapper = styled.div`
    display: flex;
    width: 35%;
    height: 500px;
    border: 2px solid #EAEAEA;
    border-radius: 15px;
    flex-direction: column;
    padding: 24px;
    justify-content: center;
    align-items: center;
    gap: 1rem;


    @media(max-width: 1800px){  
        width: 40%;
    }
`

const Text = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 90%;

    @media(min-width: 1200px) and (max-width: 2000px){  
        width: 100%;
    }
`