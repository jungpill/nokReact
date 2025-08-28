import React, { useMemo } from 'react'
import styled from 'styled-components'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import 'echarts-gl' // 타입 에러시: src/types/echarts-gl.d.ts에 declare module 'echarts-gl';
import {
  TooltipComponent,
  VisualMapComponent,
  TitleComponent,
  DatasetComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// ✅ 기본 데이터(필수 형태: { [label]: [x,y,z,color] })
import { data as defaultData } from './3dData'

echarts.use([TooltipComponent, VisualMapComponent, TitleComponent, DatasetComponent, CanvasRenderer])

type RawDict = Record<string, [number, number, number, number]>;

interface Props {
  title?: string
  raw?: RawDict                 // ⬅️ 선택값: 안 주면 defaultData 사용
  height?: number               // 기본 520
  pointSize?: number            // 기본 6
  background?: string           // 기본 '#1f2228'
  autoRotate?: boolean          // 기본 true
}

const CorpusScatter3DFromDict: React.FC<Props> = ({
  title = '코퍼스 분석',
  raw,
  height = 520,
  pointSize = 6,
  background = '#1f2228',
  autoRotate = true,
}) => {
  // ⬅️ 우선순위: props.raw → 3dData.data
    const source: RawDict = raw ?? (defaultData as unknown as RawDict);

  // 1) 데이터 변환
  const { seriesData, ext } = useMemo(() => {
    const entries = Object.entries(source)
    const arr = entries.map(([name, v]) => {
      const [x, y, z, c] = v
      return { name, value: [x, y, z, c] }
    })

    // 범위 계산
    const xs = entries.map(([, v]) => v[0])
    const ys = entries.map(([, v]) => v[1])
    const zs = entries.map(([, v]) => v[2])
    const cs = entries.map(([, v]) => v[3])

    const min = (a: number[]) => Math.min(...a)
    const max = (a: number[]) => Math.max(...a)
    const padRange = (lo: number, hi: number, padRatio = 0.08) => {
      const r = Math.max(hi - lo, 1e-6)
      const pad = r * padRatio
      return [lo - pad, hi + pad] as const
    }

    const [xMin, xMax] = padRange(min(xs), max(xs))
    const [yMin, yMax] = padRange(min(ys), max(ys))
    const [zMin, zMax] = padRange(min(zs), max(zs))
    const cMin = min(cs)
    const cMax = max(cs)

    return {
      seriesData: arr,
      ext: { xMin, xMax, yMin, yMax, zMin, zMax, cMin, cMax },
    }
  }, [source])

  // 2) 옵션
  const option: any = useMemo(
    () => ({
      backgroundColor: background,
      title: {
        text: title,
        left: 16,
        top: 12,
        textStyle: { color: '#e9edf1', fontWeight: 800, fontSize: 22 },
      },
      tooltip: {
        confine: true,
        formatter: (p: any) => {
          const [x, y, z, c] = p.value as number[]
          return `<b>${p.name}</b><br/>X: ${x.toFixed(3)}<br/>Y: ${y.toFixed(3)}<br/>Z: ${z.toFixed(3)}<br/>색값: ${c.toFixed(3)}`
        },
        backgroundColor: 'rgba(20,22,28,0.92)',
        borderColor: '#3e4bff',
        textStyle: { color: '#fff' },
      },
      visualMap: {
        show: false,
        dimension: 3,                 // value[3] = color 값
        min: ext.cMin,
        max: ext.cMax,
        inRange: {
          color: [
            '#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d',
            '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'
          ],
        },
      },
      grid3D: {
        boxWidth: 180,
        boxDepth: 180,
        boxHeight: 180,
        environment: background,
        axisPointer: { lineStyle: { color: '#8aa1b1', opacity: 0.35 } },
        viewControl: {
          projection: 'perspective',
          autoRotate,
          autoRotateSpeed: 8,
          damping: 0.5,
          rotateSensitivity: 1,
          zoomSensitivity: 1.2,
          panSensitivity: 1,
          distance: 260,        // ▲ 기본보다 멀리(예: 200~320 사이에서 맞춰봐)
          minDistance: 120,     // 휠로 너무 가까워지지 않게
          maxDistance: 800,  
        },
        light: {
          main: { intensity: 1.15, shadow: false },
          ambient: { intensity: 0.6 },
        },
      },
      xAxis3D: makeAxis('X', ext.xMin, ext.xMax),
      yAxis3D: makeAxis('Y', ext.yMin, ext.yMax),
      zAxis3D: makeAxis('Z', ext.zMin, ext.zMax),
      series: [
        {
          type: 'scatter3D',
          data: seriesData,
          symbolSize: pointSize,
          itemStyle: { opacity: 0.95 },
          emphasis: { itemStyle: { opacity: 1 } },
          shading: 'lambert',
          progressive: 6000,
          blendMode: 'source-over',
        },
      ],
    }),
    [background, title, autoRotate, pointSize, seriesData, ext]
  )

  return (
    <AutoBox $ratio={2/1} $minH={420}>
      <ReactEChartsCore echarts={echarts} option={option} notMerge lazyUpdate style={{height: '100%'}}/>
    </AutoBox>
  )
}

export default CorpusScatter3DFromDict

function makeAxis(name: string, min: number, max: number) {
  return {
    name,
    min, max,
    nameTextStyle: { color: '#cfd6df', fontWeight: 700, fontSize: 14, align: 'center' },
    axisLine: { lineStyle: { color: '#91a0ac' } },
    axisLabel: { color: '#cfd6df', formatter: (v: number) => v.toFixed(1) },
    splitLine: { lineStyle: { color: 'rgba(200, 210, 222, 0.25)' } },
  }
}

const AutoBox = styled.div<{ $ratio?: number; $minH?: number; $maxH?: number }>`
  width: 100%;
  aspect-ratio: ${p => p.$ratio ?? (16 / 9)};   /* 예: 16:9 */
  min-height: ${p => (p.$minH ? `${p.$minH}px` : '360px')};
  max-height: ${p => (p.$maxH ? `${p.$maxH}px` : 'none')};
  border-radius: 16px;
  overflow: hidden;
`;
const Hint = styled.div`
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-size: 12px;
  color: #a9b6c6;
  background: rgba(0, 0, 0, 0.35);
  padding: 4px 8px;
  border-radius: 8px;
  pointer-events: none;
`