import styled from 'styled-components'
import React, {useEffect, useState} from 'react'
import {color} from '../../style/color'
import {getCommunicationStatus} from '../../service/dashboard'

interface Props{
    selectedGroupId: string
}

const Calendar: React.FC<Props> = ({selectedGroupId}) => {
    
    const [data, setData] = useState<any[]>([])
    const week = ['월', '화', '수', '목', '금', '토', '일']

    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()

    const [weeksInMonth, setWeeksInMonth] = useState<number[]>([]);

    const lastDayOfCurrentMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfCurrentMonth = new Date(year, month, 1).getDay();
    const adjustedFirstDay = (firstDayOfCurrentMonth === 0) ? 6 : firstDayOfCurrentMonth - 1;

    useEffect(() => {
        const getCommunicationStatusData = async () => {
            const temp:any[]= []
            const res = await getCommunicationStatus(selectedGroupId)
            res.map((item: any) => {
                temp.push(item.week_of_month)
            })
            setData(temp)
            console.log(res)
        }

        getCommunicationStatusData()
    }, [selectedGroupId])

    useEffect(() => {

        // 달의 총 주(week) 수 계산
        const weekCount = Math.ceil((lastDayOfCurrentMonth + adjustedFirstDay) / 7);

        // weekCount만큼의 길이를 가진 배열을 생성하여 상태 업데이트
        setWeeksInMonth(Array.from({ length: weekCount }));
    }, [year, month]);

    // 라이브러리 없이 만들어보고 싶어서 했는데 만들다보니 주석을 깜박했습니다. 
    // 추후 노크 개발하게 되시는 분 얼른 이직준비하세요 ㅎ 

    return(
        <Container>
                <Week style={{marginLeft: '2rem'}}>
                    {week.map(day => <DayCell key={day}>{day}</DayCell>)}
                </Week>

                {weeksInMonth.map((_, weekIndex) => (
                    <Week key={weekIndex}>
                        <Label style={{ marginRight: '0.8rem' }}>{weekIndex + 1}주차</Label>
                        {week.map((_, dayIndex) => {
                        
                        const dayNumber = weekIndex * 7 + dayIndex - adjustedFirstDay + 1;

                        const dataIndex = dayNumber 

                        const isValidDate = dayNumber > 0 && dayNumber <= lastDayOfCurrentMonth;

                        return (
                            <Item
                            key={dayIndex}
                            isAcitve={isValidDate && data[dataIndex] >= 4}
                            style={{
                                opacity: isValidDate ? 1 : 0,
                            }}
                            />
                        );
                        })}
                    </Week>
                ))}
            
        </Container>    
    )
}

export default Calendar;

const Container = styled.div`
    display: flex;
    flex-direction: column; 
    width: 100%;
    height: 100%;
    margin-top: 1rem;
`

const Week = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 0.75rem;
`

const DayCell = styled.div`
    color: ${color.black};
    font-size: 1rem;
    margin-left: 2rem;
`

const Item = styled.div<{isAcitve: boolean}>`
    background-color: ${props => props.isAcitve ? '#25E8BB' : color.gray};
    border-radius: 200%;
    width: 1.25rem;
    heightL 2rem;
    margin-right: 1.63rem;
`
const Label = styled.label`
    text-align: center;
    width: 3rem;
`