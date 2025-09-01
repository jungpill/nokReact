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

/** ---------- UI용 검정 점: r.max(바깥 링) 위치에 임의 각도 배치 ---------- */
const uiDots: Plugin<'radar'> = {
  id: 'uiDots',
  beforeDatasetsDraw(chart, _args, opts: any) {
    const r: any = chart.scales?.r
    if (!r) return

    const cx = r.xCenter
    const cy = r.yCenter
    const v = r.max // 항상 바깥 링

    const dots: Array<{ angleDeg: number; radius?: number; color?: string }> =
      opts?.dots ?? [
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

const valueBadges: Plugin<'radar'> = {
  id: 'valueBadges',
  afterDatasetsDraw(chart, _args, opts: any) {
    const r: any = chart.scales?.r
    const labels: string[] = (chart.data.labels as string[]) || []
    if (!r || !labels.length) return

    const values: number[] = opts?.values || []
    const units: string[] = opts?.units || []
    const offsets: number[] | number = opts?.offsets ?? 22 // +바깥, -안쪽
    const fontSize: number = opts?.fontSize ?? 12
    const borderColor: string = opts?.borderColor ?? '#0062FF'
    const fillColor: string = opts?.fillColor ?? '#fff'
    const textColor: string = opts?.textColor ?? '#000'
    const circleColor: string = opts?.circleColor ?? '#0062FF'
    const circleR: number = opts?.circleRadius ?? 5
    const gap: number = 6
    const padX: number = 8
    const padY: number = 4

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

    for (let i = 0; i < labels.length; i++) {
      // 바깥 링 기준점
      const p = r.getPointPositionForValue(i, r.max)
      const vx = p.x - cx
      const vy = p.y - cy
      const len = Math.hypot(vx, vy) || 1
      const ux = vx / len
      const uy = vy / len

      const off = Array.isArray(offsets) ? offsets[i] ?? 22 : offsets
      const ax = p.x + ux * off
      const ay = p.y + uy * off

      const text = `${values[i] ?? 0}${units[i] ?? ''}`
      const textW = ctx.measureText(text).width
      const h = Math.max(2 * circleR + 8, fontSize + padY * 2)
      const w = padX + circleR * 2 + gap + textW + padX
      const x = ax - w / 2
      const y = ay - h / 2
      const radius = h / 2

      ctx.fillStyle = fillColor
      roundRect(x, y, w, h, radius)
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.fillStyle = circleColor
      ctx.arc(x + padX + circleR, y + h / 2, circleR, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = textColor
      ctx.fillText(text, x + padX + circleR * 2 + gap, y + h / 2)
    }

    ctx.restore()
  },
}

/** ---------- 커스텀 라벨: 원 밖으로, 축선 위 중앙 배치(축별 오프셋) ---------- */
const customLabels: Plugin<'radar'> = {
  id: 'customLabels',
  afterDraw(chart, _args, opts: any) {
    const r: any = chart.scales?.r
    if (!r) return
    const labels: string[] = (chart.data.labels as string[]) || []
    const values: number[] = opts?.values || []
    const units: string[] = opts?.units || []
    const radialOffsets = opts?.radialOffsets ?? 28 // +바깥, -안쪽
    const tangentOffsets = opts?.tangentOffsets ?? 0 // 축에 수직 이동
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
      const vx = p.x - cx
      const vy = p.y - cy
      const L = Math.hypot(vx, vy) || 1
      const ux = vx / L
      const uy = vy / L
      const tx = -uy
      const ty = ux

      const ro = as(radialOffsets, i, 28)
      const to = as(tangentOffsets, i, 0)

      const x = p.x + ux * ro + tx * to
      const y = p.y + uy * ro + ty * to

      const text = labels[i]
      ctx.fillText(text, x, y)
    }

    ctx.restore()
  },
}

ChartJS.register(uiDots, valueBadges, customLabels)

interface Props {
  chartData: {
    login_count: number
    article_count: number
    search_count: number
  }
}

const SolutionChart: React.FC<Props> = ({ chartData }) => {
  const labels = ['접속 횟수', '누적 기록 수', '키워드 검색']

  // 데이터
  const student = [chartData.login_count, chartData.article_count, chartData.search_count]
  const rawMax = Math.max(...student)
  const rMax = Math.ceil(rawMax * 1.1) // 최댓값의 110%

  const data: ChartData<'radar'> = {
    labels,
    datasets: [
      {
        label: '평균 학생',
        data: student,
        borderColor: '#1b56ff',
        backgroundColor: 'rgba(0, 98, 255, 0.40)',
        pointBackgroundColor: '#0062FF',
        pointBorderColor: '#0062FF',
        pointRadius: 6,
        fill: true,
        order: 1,
        borderJoinStyle: 'miter',
      },
    ],
  }

  const options: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top', align: 'end', labels: { usePointStyle: true } },
    tooltip: { enabled: false },

    // 검은 점(그대로)
    uiDots: {
      dots: [
        { angleDeg: 60,  radius: 3, color: '#7A8E98' },
        { angleDeg: 180, radius: 3, color: '#7A8E98' },
        { angleDeg: 300, radius: 3, color: '#7A8E98' },
      ],
    },

    // ✅ 라벨: 원 "밖" + 축의 중앙(수직 이동 0) / 좌·우는 약간 보정
    // 인덱스 0=접속 횟수(위), 1=누적 기록 수(오른쪽 아래), 2=키워드 검색(왼쪽 아래)
    customLabels: {
      values: student,
      units: ['회', '개', '회'],
      radialOffsets:  [48, 55, 55],   // 🔵 라벨을 원 밖으로 (상단은 더 멀리)
      tangentOffsets: [ 0, 20, -20], // 🔵 라벨을 축에 수직으로 좌/우 미세 이동해서 “정중앙” 느낌 보정
      font: '700 16px system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      color: '#0b0b0b',
    },

    // ✅ 배지(말풍선): 라벨과 간격 확보 → 원 "안쪽"으로 조금 더
    valueBadges: {
      values: student,
      units:  ['회', '개', '회'],
      offsets: [24, 40, 40], // 음수=안쪽. 라벨과 겹침 방지
      circleRadius: 5,
      borderColor: '#0062FF',
      circleColor: '#0062FF',
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
      grid: { color: 'rgba(0,0,0,0.15)', circular: true, borderDash: [10,6], lineWidth: 1 },
      angleLines: { color: 'rgba(0,0,0,0.15)', borderDash: [2,3], lineWidth: 1 },
      pointLabels: { display: false }, // 기본 라벨 숨김(커스텀 사용)
    },
  },
  // 라벨이 캔버스 밖으로 닿으면 여기만 살짝 늘려줘
  layout: { padding: { top: 64, right: 44, bottom: 52, left: 44 } },
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
