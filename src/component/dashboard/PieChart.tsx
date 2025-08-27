import React from "react";
import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface DataItem {
  name: string;
  count: number;
}

interface Props {
  data: DataItem[];
}

const PieChart: React.FC<Props> = ({ data }) => {
  const total = data.reduce((acc, cur) => acc + cur.count, 0);

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) =>
          ((item.count / total) * 100).toFixed(0) // 퍼센트
        ),
        backgroundColor: [
          "#0D2F66",
          "#1D4ED8",
          "#3B82F6",
          "#60A5FA",
          "#93C5FD",
          "#BFDBFE",
          "#DBEAFE",
          "#E0E7FF",
          "#C7D2FE",
          "#A5B4FC",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
        label: function (context: any) {
          // context.raw 에 현재 조각의 데이터 값이 들어있음
          const value = context.raw;
          return `${value}%`;  // ← 여기서 % 붙여주기
        },
      },
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold" as const,
          size: 14,
        },
        formatter: (value: any, context: any) => {

          const label = context.chart.data.labels[context.dataIndex];
          return `${label}`;
        },
      },
    },
  };

  return (
    <Wrapper>
      <Pie data={chartData} options={options} />

      <TopTenList>
        {data.map((item, index) => {
            return(
                <Item key={index}>
                    <label style={{fontSize: '1.25rem', fontWeight: '700', width: '30px' }}>
                        {index + 1}. 
                    </label> 
                    {item.name}
                </Item>
            )
        })}
      </TopTenList>
    </Wrapper>
  );
};

export default PieChart;

const Wrapper = styled.div`
    width: 300px;
    height: 300px;
    margin: 20px;
    display: flex;
    justify-content: center;
`;

const TopTenList = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px; 
    margin-left: 4rem;
`

const Item = styled.div`
    display: flex;
    font-size: 0.8rem;
    font-weight: 500;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 200px;

    &:hover {
        background-color: #f9f9f9;
    }
`
