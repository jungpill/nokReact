import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend,
  type ChartOptions, type Plugin
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type Payload = {
  note_usage_data: Record<string | number, number>;
  student_id: string;
  year: number;
};

type Props = {
  payload?: Payload | null;
  height?: number; // px
};

const monthsKo = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

const MonthlyNoteUsageChart: React.FC<Props> = ({ payload, height = 360 }) => {
  // 값 배열(없으면 0)
  const values = useMemo(() => {
    const src = payload?.note_usage_data ?? {};
    return Array.from(
      { length: 12 },
      (_, i) => Number(src[i + 1] ?? src[String(i + 1)] ?? 0)
    );
  }, [payload]);

  

  // y축 범위 - 최대값 기준 10%씩 줄여서 11개 표시 (100% ~ 0%)
  const maxVal = Math.max(...values, 0);
  const yMax = Math.max(100, Math.ceil(maxVal * 1.1)); // 최소 100, 데이터 최대값 + 10%
  const step = yMax / 10; // 10%씩 줄여서 11개 표시 (0, 10%, 20%, ..., 100%)

  // Chart.js 데이터(항상 객체!)
  const data = useMemo(() => {
    return {
      labels: monthsKo,
      datasets: [
        {
          label: `${payload?.year ?? ''} 노트 사용량`,
          data: values,
          borderColor: '#5A9FEE',
          tension: 0,
          backgroundColor: (ctx: any) => {
            const chart = ctx.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return 'rgba(0, 99, 213, 0.4)'; // 초기 렌더 보호
            const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, 'rgba(0, 99, 213, 0.5)');   
            g.addColorStop(1, 'rgba(115, 155, 200, 0.25)');
            return g;
          },
          borderWidth: 5,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 6,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#5A9FEE',
          pointBorderWidth: 4,
        },
      ],
    };
  }, [values, payload?.year]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 8 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false, intersect: true, mode: 'nearest', external: () => {} },
      datalabels: { display: false }
    },
    scales: {
      x: {
        grid: { 
          display: true, 
          color: 'rgba(0,0,0,0.08)', 
          lineWidth: 1,
          drawOnChartArea: true, // 세로선 표시
        },
        ticks: { font: { size: 14, weight: 600 } },
        border: { display: false },
      },
      y: {
        min: 0,
        max: yMax,
        ticks: { 
          stepSize: step, 
          font: { size: 12 },
          // 11개 틱 표시 (0, 10%, 20%, ..., 100%)
          callback: function(value: any) {
            return Math.round(value);
          }
        },
        grid: { 
          display: true, 
          color: 'rgba(0,0,0,0.08)', 
          lineWidth: 1,
          drawOnChartArea: true, // 가로선 표시
        },
        border: { display: false },
      },
    },
    elements: { line: { capBezierPoints: true } },
    hover: { intersect: true, mode: 'nearest' },
  };

  return (
    <div style={{ width: '100%', height }}>
      <Line data={data} options={options}  />
    </div>
  );
};

export default MonthlyNoteUsageChart;
