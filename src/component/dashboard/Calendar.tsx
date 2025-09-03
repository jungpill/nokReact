import styled from 'styled-components'
import React, {useEffect, useState, useContext} from 'react'
import {color} from '../../style/color'
import {getCommunicationStatus} from '../../service/dashboard'
import Tooltip from '../common/Tooltip'

interface Props{
    selectedGroupId: string
    onWeekTotalChange?: (weekTotal: number) => void
}

const Calendar: React.FC<Props> = ({selectedGroupId, onWeekTotalChange}) => {
    
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
        }

        getCommunicationStatusData()
    }, [selectedGroupId])

    useEffect(() => {

        // 달의 총 주(week) 수 계산
        const weekCount = Math.ceil((lastDayOfCurrentMonth + adjustedFirstDay) / 7);

        // weekCount만큼의 길이를 가진 배열을 생성하여 상태 업데이트
        setWeeksInMonth(Array.from({ length: weekCount }));
    }, [year, month]);

    const todayDate = today.getDate();
    const currentWeekIndex = Math.floor((todayDate + adjustedFirstDay - 1) / 7);

    // 이번 주 월요일(달력 그리드 기준 dayNumber)과 일요일
    const monday = Math.max(1, currentWeekIndex * 7 - adjustedFirstDay + 1);
    const sunday = Math.min(lastDayOfCurrentMonth, monday + 6);

    // ✅ 이번 주 글/댓글 합계 (달력 데이터 구조 그대로 사용)
    let weekPosts = 0;
    let weekComments = 0;
    for (let d = monday; d <= sunday; d++) {
    weekPosts += data[d]?.posts ?? 0;
    weekComments += data[d]?.comments ?? 0;
    }
    const weekTotal = weekPosts + weekComments;

    // weekTotal이 변경될 때마다 부모 컴포넌트에 알림
    useEffect(() => {
        if (onWeekTotalChange) {
            onWeekTotalChange(weekTotal);
        }
    }, [weekTotal, onWeekTotalChange]);

    // 라이브러리 없이 만들어보고 싶어서 했는데 만들다보니 주석을 깜박했습니다. 
    // 추후 노크 개발하게 되시는 분 하루빨리 이직준비하세요 ㅎ 

    return(
        <Container>
                <Week style={{marginLeft: '2rem'}}>
                    {week.map(day => <DayCell key={day}>{day}</DayCell>)}
                </Week>

                {weeksInMonth.map((_, weekIndex) => (
                    <Week key={weekIndex}>
                        <Label style={{ marginRight: '0.8rem', minWidth: '48px' }}>{weekIndex + 1}주차</Label>
                        {week.map((_, dayIndex) => {
                        
                        const dayNumber = weekIndex * 7 + dayIndex - adjustedFirstDay + 1;

                        const dataIndex = dayNumber 

                        const isValidDate = dayNumber > 0 && dayNumber <= lastDayOfCurrentMonth;

                        return (
                            <Tooltip
                                key={dayIndex}
                                placement="top"
                                disabled={!isValidDate}
                                content={
                                    <>
                                       {dataIndex} 글 {data[dataIndex]?.posts ?? 0} 댓글 {data[dataIndex]?.comments ?? 0}
                                    </>
                                }
                            >
                                <Item
                                    isAcitve={data[dataIndex]?.posts + data[dataIndex]?.comments >= 1}
                                    style={{ opacity: isValidDate ? 1 : 0 }}
                                />
                            </Tooltip>
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
    justify-content: center;
`

const Week = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
    align-items: center;
`

const DayCell = styled.div`
    color: ${color.black};
    font-size: 1rem;
    margin-left: 2.23rem;
`

const Item = styled.div<{isAcitve: boolean}>`
    background-color: ${props => props.isAcitve ? '#25E8BB' : color.gray};
    border-radius: 200%;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1.63rem;
`
const Label = styled.label`
    text-align: center;
    width: 3rem;
`
