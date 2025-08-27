import styled from 'styled-components'
import React, {useEffect, useState} from 'react'
import {color} from '../../style/color'

const Calendar: React.FC = () => {
    const data = [0, 5, 74, 5, 1, 1, 9, 1, 2, 5, 4, 0, 74, 6, 2, 0, 44, 2, 5, 2, 6, 6, 6, 1, 2, 8, 4, 9, 6,]
    console.log(data.length)
    const week = ['월', '화', '수', '목', '금', '토', '일']

    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 3

    const [weeksInMonth, setWeeksInMonth] = useState<number[]>([]);

    const lastDayOfCurrentMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfCurrentMonth = new Date(year, month, 1).getDay();
    const adjustedFirstDay = (firstDayOfCurrentMonth === 0) ? 6 : firstDayOfCurrentMonth - 1;
    

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

                {weeksInMonth.map((_, index) => <Week key={index}>
                    <Label style={{marginRight: '0.8rem'}}>{index + 1}주차</Label>
                    {week.map((e,index2) => {
                        return <Item 
                        key={index2}
                        isAcitve={data[(index2) * (index+1)] >= 4} 
                        style={{
                            opacity: index === 0 && adjustedFirstDay - index2 > 0 ? 0 : ((index+1) * 7) + (index2 - 7)  >= adjustedFirstDay + lastDayOfCurrentMonth ? 0 : 1 }}
                            />
                    })}
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
    display: flex;
    flex-direction: row;
    margin-bottom: 0.75rem;
`

const DayCell = styled.div`
    color: ${color.black}
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