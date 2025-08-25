import {Radar} from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const SolutionChart = () => {

    const labels = ['접속 횟수', '누적 기록 수', '키워드 검색'] // 축 라벨(시계 방향)

    // 예시 데이터 (학생 / 평균)
    const student = [180, 150, 132]
    const average = [30, 36, 150]

    const data = {
        labels,
        datasets: [
          {
            label: '해당 학생',
            data: student,
            borderColor: '#54e0e8',
            backgroundColor: 'rgba(84,224,232,0.28)',
            pointBackgroundColor: '#54e0e8',
            pointBorderColor: '#54e0e8',
            pointRadius: 4,
            fill: true,
            tension: 0.2,
          },
          {
            label: '평균 학생',
            data: average,
            borderColor: '#1b56ff',
            backgroundColor: 'rgba(27,86,255,0.20)',
            pointBackgroundColor: '#1b56ff',
            pointBorderColor: '#1b56ff',
            pointRadius: 4,
            fill: true,
            tension: 0.2,
          },
        ],
      }
    
      const options: any = {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'right', labels: { usePointStyle: true } },
          tooltip: { enabled: false }, 
        },
        scales: {
          r: {
            min: 0,
            suggestedMax: 200, 
            ticks: { display: false },
            grid: { color: 'rgba(0,0,0,0.15)', circular: true, borderDash: [10,6], lineWidth: 3 },
            angleLines: { 
                color: 'rgba(0,0,0,0.15)',
                borderDash: [2,3],
                lineWidth: 3,
             },
            pointLabels: {
              color: '#0b0b0b',
              font: { size: 16, weight: '700' },
            },
          },
        },
        layout: { padding: { top: 30, right: 30, bottom: 30, left: 30 } },
      }

    return (
        <Radar data={data} options={options} />
    )
}

export default SolutionChart;