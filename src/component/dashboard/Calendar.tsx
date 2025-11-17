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
        if (!selectedGroupId) return
        const getCommunicationStatusData = async () => {
            const temp:any[]= [{posts: 0, comments: 0}]
            const res = await getCommunicationStatus(selectedGroupId)
            res.map((item: any) => {
                temp.push({posts: item.posts, comments: item.comments})
            })
            console.log(temp)
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

    return(
        <Container>
    {/* 요일 헤더: 주차 칸과 동일한 첫 칸(비워두기) */}
    <RowGrid role="rowheader">
      <HeaderStub aria-hidden /> 
      {week.map((day) => (
        <HeaderCell key={day}>{day}</HeaderCell>
      ))}
    </RowGrid>

    {weeksInMonth.map((_, weekIndex) => (
      <RowGrid key={weekIndex}>
        <Label>{weekIndex + 1}주차</Label>

        {week.map((_, dayIndex) => {
          const dayNumber = weekIndex * 7 + dayIndex - adjustedFirstDay + 1;
          const isValidDate = dayNumber > 0 && dayNumber <= lastDayOfCurrentMonth;
          const dataIndex = dayNumber;

          return (
            <Tooltip
              key={dayIndex}
              placement="top"
              disabled={!isValidDate}
              content={
                <>
                  글 {data[dataIndex]?.posts ?? 0} 댓글 {data[dataIndex]?.comments ?? 0}
                </>
              }
            >
              <Item
                isAcitve={(data[dataIndex]?.posts ?? 0) + (data[dataIndex]?.comments ?? 0) >= 3}
                data-valid={isValidDate}
              />
            </Tooltip>
          );
        })}
      </RowGrid>
    ))}
  </Container>    
    )
}

export default Calendar;

const Container = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 1rem;
`;

const GRID_COLS = '3rem repeat(7, minmax(0, 50px))';

const RowGrid = styled.div`
  display: grid;
  grid-template-columns: ${GRID_COLS};
  align-items: center;
  gap: 10px;
`;

const HeaderStub = styled.div`
  width: 3rem; /* Label과 동일 폭 */
`;

const HeaderCell = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  line-height: 1;
`;

const Label = styled.div`
  text-align: center;
  width: 3rem; /* 그리드 첫 컬럼 폭과 동일 */
  font-weight: 600;
`;

const Item = styled.div<{ isAcitve: boolean }>`
  /* 그리드 셀 안에서 가운데 정렬용: 부모(RowGrid)가 grid라 각 칸은 자동으로 채워짐.
     원은 자기 자신을 중앙 배치하기 위해 margin: 0 auto 사용 */
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: ${p => (p.isAcitve ? '#25E8BB' : color.gray)};
  margin: 0 auto;            /* 가로 중앙 */
  display: grid;
  place-items: center;       /* 내부 콘텐츠 중앙(아이콘/숫자 넣을 때 유용) */
`;