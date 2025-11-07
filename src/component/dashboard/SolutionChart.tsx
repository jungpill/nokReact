import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
  type ChartData,
  type Plugin,
} from 'chart.js'
import React from 'react'
import styled from 'styled-components'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Legend, Tooltip)
ChartJS.defaults.elements.line.tension = 0

/** ---------- UI용 검정 점 ---------- */
const uiDots: Plugin<'radar'> = {
  id: 'uiDots',
  beforeDatasetsDraw(chart, _args, opts: any) {
    const r: any = chart.scales?.r
    if (!r) return
    const cx = r.xCenter, cy = r.yCenter, v = r.max
    const dots = opts?.dots ?? [
      { angleDeg: 60, radius: 3, color: '#7A8E98' },
      { angleDeg: 180, radius: 3, color: '#7A8E98' },
      { angleDeg: 300, radius: 3, color: '#7A8E98' },
    ]
    const toRad = (deg: number) => -Math.PI / 2 + (deg * Math.PI) / 180
    const ctx = chart.ctx
    ctx.save()
    for (const d of dots) {
      const dist = r.getDistanceFromCenterForValue(v)
      const ang = toRad(d.angleDeg)
      const x = cx + Math.cos(ang) * dist
      const y = cy + Math.sin(ang) * dist
      ctx.beginPath()
      ctx.fillStyle = d.color ?? '#7A8E98'
      ctx.arc(x, y, d.radius ?? 3, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  },
}

/** ---------- 한 배지 안에 '해당/평균' 동시 표기 ---------- */
const valueBadges: Plugin<'radar'> = {
  id: 'valueBadges',
  afterDatasetsDraw(chart, _args, opts: any) {
    const r: any = chart.scales?.r
    const labels: string[] = (chart.data.labels as string[]) || []
    if (!r || !labels.length) return

    const valuesA: (number | null | undefined)[] = opts?.valuesA || []
    const valuesB: (number | null | undefined)[] = opts?.valuesB || []
    const units: string[] = opts?.units || []

    const offsets: number[] | number = opts?.offsets ?? 22
    const fontSize: number = opts?.fontSize ?? 12
    const borderColor: string = opts?.borderColor ?? '#0062FF'
    const fillColor: string = opts?.fillColor ?? '#fff'
    const textColor: string = opts?.textColor ?? '#000'
    const dotAColor: string = opts?.dotAColor ?? '#66EAEF'
    const dotBColor: string = opts?.dotBColor ?? '#0062FF'
    const circleR: number = opts?.circleRadius ?? 5
    const gapDotText = 6
    const gapBetweenTwo = 16
    const padX = 8
    const padY = 4

    // ✅ 값 포매터: 없으면 '-'
    const fmt = (v: any, unit?: string) => {
      if (v === 0) return '-';                          // ⬅️ 0일 때 하이픈
      if (v == null || Number.isNaN(v)) return '-';     // 필요 없으면 이 줄 지워도 됨
      return `${v}${unit ?? ''}`;
    };

    const ctx = chart.ctx
    const cx = r.xCenter
    const cy = r.yCenter

    const roundRect = (x: number, y: number, w: number, h: number, radius: number) => {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.arcTo(x + w, y, x + w, y + h, radius)
      ctx.arcTo(x + w, y + h, x, y + h, radius)
      ctx.arcTo(x, y + h, x, y, radius)
      ctx.arcTo(x, y, x + w, y, radius)
      ctx.closePath()
    }

    ctx.save()
    ctx.font = `700 ${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`
    ctx.textBaseline = 'middle'
    ctx.lineWidth = 2
    ctx.strokeStyle = borderColor
    ctx.fillStyle = textColor

    for (let i = 0; i < labels.length; i++) {
      const p = r.getPointPositionForValue(i, r.max)
      const vx = p.x - cx, vy = p.y - cy
      const len = Math.hypot(vx, vy) || 1
      const ux = vx / len, uy = vy / len

      const off = Array.isArray(offsets) ? offsets[i] ?? 22 : offsets
      const ax = p.x + ux * off
      const ay = p.y + uy * off

      // ✅ 표시 텍스트는 fmt 사용
      const tA = fmt(valuesA[i], units[i])
      const tB = fmt(valuesB[i], units[i])

      const wA = ctx.measureText(tA).width
      const wB = ctx.measureText(tB).width

      const contentW = circleR * 2 + gapDotText + wA + gapBetweenTwo + circleR * 2 + gapDotText + wB
      const h = Math.max(2 * circleR + 8, fontSize + padY * 2)
      const w = padX + contentW + padX
      const x = ax - w / 2
      const y = ay - h / 2
      const radius = h / 2

      ctx.fillStyle = fillColor
      roundRect(x, y, w, h, radius)
      ctx.fill()
      ctx.stroke()

      // 왼쪽(해당)
      let cxp = x + padX + circleR
      const cyp = y + h / 2
      ctx.beginPath()
      ctx.fillStyle = dotAColor
      ctx.arc(cxp, cyp, circleR, 0, Math.PI * 2)
      ctx.fill()
      cxp += circleR + gapDotText
      ctx.fillStyle = textColor
      ctx.fillText(tA, cxp, cyp)

      // 오른쪽(평균)
      cxp = x + padX + (circleR * 2 + gapDotText + wA) + gapBetweenTwo + circleR
      ctx.beginPath()
      ctx.fillStyle = dotBColor
      ctx.arc(cxp, cyp, circleR, 0, Math.PI * 2)
      ctx.fill()
      cxp += circleR + gapDotText
      ctx.fillStyle = textColor
      ctx.fillText(tB, cxp, cyp)
    }

    ctx.restore()
  },
}

/** ---------- 축 라벨(위치/오프셋 유지) ---------- */
const customLabels: Plugin<'radar'> = {
  id: 'customLabels',
  afterDraw(chart, _args, opts: any) {
    const r: any = chart.scales?.r
    if (!r) return
    const labels: string[] = (chart.data.labels as string[]) || []

    const radialOffsets = opts?.radialOffsets ?? 28
    const tangentOffsets = opts?.tangentOffsets ?? 0
    const font = opts?.font || '700 16px system-ui,-apple-system,Segoe UI,Roboto,sans-serif'
    const color = opts?.color || '#0b0b0b'

    const as = (v: any, i: number, def: number) =>
      Array.isArray(v) ? v[i] ?? def : v ?? def

    const ctx = chart.ctx
    const cx = r.xCenter
    const cy = r.yCenter
    const max = r.max

    ctx.save()
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < labels.length; i++) {
      const p = r.getPointPositionForValue(i, max)
      const vx = p.x - cx, vy = p.y - cy
      const L = Math.hypot(vx, vy) || 1
      const ux = vx / L, uy = vy / L
      const tx = -uy, ty = ux

      const ro = as(radialOffsets, i, 28)
      const to = as(tangentOffsets, i, 0)

      const x = p.x + ux * ro + tx * to
      const y = p.y + uy * ro + ty * to
      ctx.fillText(labels[i], x, y)
    }

    ctx.restore()
  },
}

ChartJS.register(uiDots, valueBadges, customLabels)

interface Props {
  chartData: {
    monthly_access_counts: { average_student_access_count: number; student_access_count: number }
    monthly_keyword_search_counts: { average_student_keyword_search_count: number; student_keyword_search_count: number }
    monthly_note_usage_counts: { average_student_note_usage_count: number; student_note_usage_count: number }
  }
}

const SolutionChart: React.FC<Props> = ({ chartData }) => {
  const labels = ['접속 횟수', '누적 기록 수', '키워드 검색']

  // ▶ 해당/평균 둘 다 준비
  const student = [
    chartData.monthly_access_counts.student_access_count,
    chartData.monthly_keyword_search_counts.student_keyword_search_count,
    chartData.monthly_note_usage_counts.student_note_usage_count,
  ]
  const average = [
    chartData.monthly_access_counts.average_student_access_count,
    chartData.monthly_keyword_search_counts.average_student_keyword_search_count,
    chartData.monthly_note_usage_counts.average_student_note_usage_count,
  ]

  const rawMax = Math.max(...student, ...average)
  const rMax = Math.ceil(rawMax * 1.1)

  const data: ChartData<'radar'> = {
    labels,
    datasets: [
      // 🔹 해당 학생(민트)
      {
        label: '해당 학생',
        data: student,
        borderColor: '#66EAEF',
        backgroundColor: 'rgba(102, 234, 239, 0.35)',
        pointBackgroundColor: '#66EAEF',
        pointBorderColor: '#66EAEF',
        pointRadius: 6,
        fill: true,
        order: 1,
        borderWidth: 4,
        borderJoinStyle: 'miter',
      },
      // 🔵 평균 학생(파랑)
      {
        label: '평균 학생',
        data: average,
        borderColor: '#0062FF',
        backgroundColor: 'rgba(0, 98, 255, 0.40)',
        pointBackgroundColor: '#0062FF',
        pointBorderColor: '#0062FF',
        pointRadius: 6,
        fill: true,
        order: 2,
        borderWidth: 4,
        borderJoinStyle: 'miter',
      },
    ],
  }

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 200,
    plugins: {
      legend: { 
        display: true, 
        position: 'right', 
        align: 'start', 
        labels: { 
          usePointStyle: true,
          bowWidth: 8,
          boxHeight: 8,
          padding: 10
        },

      },
      tooltip: { enabled: false },

      uiDots: {
        dots: [
          { angleDeg: 60, radius: 3, color: '#7A8E98' },
          { angleDeg: 180, radius: 3, color: '#7A8E98' },
          { angleDeg: 300, radius: 3, color: '#7A8E98' },
        ],
      },

      customLabels: {
        values: student,
        units: ['회', '개', '회'],
        radialOffsets: [48, 55, 55],
        tangentOffsets: [0, 20, -20],
        font: '700 16px system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
        color: '#0b0b0b',
      },

      // ▶ 배지 하나에 두 값(해당/평균)
      valueBadges: {
        valuesA: student,
        valuesB: average,
        units: ['회', '개', '회'],
        offsets: [24, 40, 40],
        circleRadius: 5,
        borderColor: '#0062FF',
        dotAColor: '#66EAEF',
        dotBColor: '#0062FF',
        fillColor: '#fff',
        textColor: '#000',
        fontSize: 12,
      },
    },
    scales: {
      r: {
        min: 0,
        max: rMax,
        ticks: { display: false, stepSize: rMax / 4 },
        grid: { color: 'rgba(0,0,0,0.15)', circular: true, borderDash: [10, 6], lineWidth: 1 },
        angleLines: { color: 'rgba(0,0,0,0.15)', borderDash: [2, 3], lineWidth: 1 },
        pointLabels: { display: false },
      },
    },
    layout: { padding: { top: 64, right: 44, bottom: 52, left: 100 } },
  }

  return (
    <Container>
      <Radar data={data} options={options} />
    </Container>
  )
}

export default SolutionChart

const Container = styled.div`
  width: 100%;
  height: 90%;
`
