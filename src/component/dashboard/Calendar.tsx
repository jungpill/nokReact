import styled from 'styled-components'
import React, {useEffect, useState} from 'react'
import {color} from '../../style/color'

const Calendar: React.FC = () => {

    const week = ['월', '화', '수', '목', '금', '토', '일']

    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()

    const [weeksInMonth, setWeeksInMonth] = useState<number[]>([]);

    const lastDayOfCurrentMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfCurrentMonth = new Date(year, month, 1).getDay();
    

    useEffect(() => {
        
        // 주의 시작을 '월요일'로 가정하여 요일 계산을 조정
        const adjustedFirstDay = (firstDayOfCurrentMonth === 0) ? 6 : firstDayOfCurrentMonth - 1;

        // 달의 총 주(week) 수 계산
        const weekCount = Math.ceil((lastDayOfCurrentMonth + adjustedFirstDay) / 7);

        // weekCount만큼의 길이를 가진 배열을 생성하여 상태 업데이트
        setWeeksInMonth(Array.from({ length: weekCount }));
    }, [year, month]);


    return(
        <Container>
                <Week style={{marginLeft: '4rem'}}>
                    {week.map(day => <DayCell key={day}>{day}</DayCell>)}
                </Week>

                {weeksInMonth.map((_, index) => <Week key={index}>
                    <Label>{index + 1}주차</Label>
                    
                </Week>)}
            
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
    gap: 2rem; 
    display: flex;
    flex-direction: row;
    margin-bottom: 0.75rem;
`

const DayCell = styled.div`
    color: ${color.black}
    font-size: 1rem;
`

const Item = styled.div`
    background-color: black;
    border-radius: 100px;
    width: 2rem;
    heightL 2rem;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2rem

`

const Row = styled.div`
    display: flex;
    flex-direction: row;
`
const Label = styled.label`
    text-align: center;
    width: 3rem;
`