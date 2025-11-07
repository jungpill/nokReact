import styled from 'styled-components'
import React, {useEffect, useMemo, useState} from 'react'
import {color} from '../../style/color'
import {getCommunicationStatus} from '../../service/dashboard'
import Tooltip from '../common/Tooltip'

interface Props{
  selectedGroupId: string
  selectedStudent: string
  onWeekTotalChange?: (weekTotal: number) => void
}

/** 일자단위 사용량 */
type DayUsage = { posts: number; comments: number; ymd?: string } | null

const Calendar: React.FC<Props> = ({selectedGroupId, selectedStudent, onWeekTotalChange}) => {
  const weekNames = ['월', '화', '수', '목', '금', '토', '일']

  // 오늘 기준 달력(현재 달)
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() // 0=1월

  const lastDayOfCurrentMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfCurrentMonth = new Date(year, month, 1).getDay() // 0=일
  const adjustedFirstDay = (firstDayOfCurrentMonth === 0) ? 6 : firstDayOfCurrentMonth - 1 // 0=월

  // 렌더 데이터
  const [byDay, setByDay] = useState<DayUsage[]>(() =>
    Array(lastDayOfCurrentMonth + 1).fill(null)
  )
  const [loading, setLoading] = useState(false)

  // 달의 총 주 수
  const weeksInMonth = useMemo(() => {
    const weekCount = Math.ceil((lastDayOfCurrentMonth + adjustedFirstDay) / 7)
    return Array.from({ length: weekCount })
  }, [lastDayOfCurrentMonth, adjustedFirstDay])

  // 데이터 가져오기 (B 프로젝트 포맷 → 일자 인덱스 배열로 어댑트)
  useEffect(() => {
    let ignore = false
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getCommunicationStatus(selectedStudent)
        // B 포맷: res.board_usage.week1..week5.by_day[]
        const usage = res?.board_usage
        const days: DayUsage[] = Array(lastDayOfCurrentMonth + 1).fill(null)

        if (usage) {
          const weekCount: number =
            typeof usage.week_count === 'number' ? usage.week_count : 6

          for (let w = 1; w <= weekCount; w++) {
            const wk = usage[`week${w}`]
            if (!wk?.by_day) continue

            for (const d of wk.by_day as any[]) {
              const ymd: string | undefined = d?.ymd
              const posts = Number(d?.post_count ?? 0)
              const comments = Number(d?.comment_count ?? 0)
              if (!ymd) continue

              // ymd → 실제 날짜 번호
              const dateObj = new Date(ymd) // 'YYYY-MM-DD'
              if (
                isNaN(dateObj.getTime()) ||
                dateObj.getFullYear() !== year ||
                dateObj.getMonth() !== month
              ) {
                continue // 다른 달/잘못된 날짜는 스킵
              }
              const dayNum = dateObj.getDate() // 1..lastDay
              days[dayNum] = { posts, comments, ymd }
            }
          }
        }

        if (!ignore) setByDay(days)
      } catch (e) {
        console.error('getCommunicationStatus error:', e)
        if (!ignore) {
          // 실패 시에도 길이만 맞춰 빈값 유지
          setByDay(Array(lastDayOfCurrentMonth + 1).fill(null))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    fetch()
    return () => {
      ignore = true
    }
  // 학생/그룹 바뀌면 새로 불러옴
  }, [selectedGroupId, selectedStudent, year, month, lastDayOfCurrentMonth])

  // 이번 주 활동량 계산 (A 프로젝트 로직 적용)
  const todayDate = today.getDate()
  const currentWeekIndex = Math.floor((todayDate + adjustedFirstDay - 1) / 7)
  
  // 이번 주 월요일과 일요일
  const monday = Math.max(1, currentWeekIndex * 7 - adjustedFirstDay + 1)
  const sunday = Math.min(lastDayOfCurrentMonth, monday + 6)
  
  // 이번 주 글/댓글 합계
  let weekPosts = 0
  let weekComments = 0
  for (let d = monday; d <= sunday; d++) {
    const usage = byDay[d]
    weekPosts += usage?.posts ?? 0
    weekComments += usage?.comments ?? 0
  }
  const weekTotal = weekPosts + weekComments

  // weekTotal이 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (onWeekTotalChange) {
      onWeekTotalChange(weekTotal)
    }
  }, [weekTotal, onWeekTotalChange])

  return (
    <Container>
      <Week style={{ marginLeft: '2rem' }}>
        {weekNames.map(day => <DayCell key={day}>{day}</DayCell>)}
      </Week>

      {weeksInMonth.map((_, weekIndex) => (
        <Week key={weekIndex}>
          <Label style={{ marginRight: '0.85rem', minWidth: '48px' }}>
            {weekIndex + 1}주차
          </Label>

          {weekNames.map((_, dayIndex) => {
            // 달력상의 실제 날짜(1..lastDay), 그 외는 음영처리
            const dayNumber = weekIndex * 7 + dayIndex - adjustedFirstDay + 1
            const isValidDate = dayNumber > 0 && dayNumber <= lastDayOfCurrentMonth

            const usage = isValidDate ? byDay[dayNumber] : null
            const posts = usage?.posts ?? 0
            const comments = usage?.comments ?? 0
            const active = posts + comments >= 3

            const tooltipContent = isValidDate
              ? <>글 {posts} 댓글 {comments}</>
              : null

            return (
              <Tooltip
                key={dayIndex}
                placement="top"
                disabled={!isValidDate}
                content={tooltipContent}
              >
                <Item
                  isActive={active}
                  style={{ opacity: isValidDate ? 1 : 0 }}
                  aria-label={
                    isValidDate
                      ? `${dayNumber}일, 글 ${posts}개, 댓글 ${comments}개`
                      : undefined
                  }
                />
              </Tooltip>
            )
          })}
        </Week>
      ))}

      {loading && <div style={{marginTop: 8, color: '#999'}}>불러오는 중…</div>}
    </Container>
  )
}

export default Calendar

// ===== 스타일 =====
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

const Item = styled.div<{isActive: boolean}>`
  background-color: ${p => (p.isActive ? '#25E8BB' : color.gray)};
  border-radius: 200%;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1.63rem;
`

const Label = styled.label`
  text-align: center;
  width: 3rem;
`