import React from "react";
import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DataItem {
  name: string;
  count: number;
}

interface Props {
  data: DataItem[];
}

const PieChart: React.FC<Props> = ({ data }) => {
  // 총합
  const total = data.reduce((acc, cur) => acc + cur.count, 0);

  // Chart.js용 데이터셋 구성
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) =>
          ((item.count / total) * 100).toFixed(0) // 비율
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
        display: false, // label은 안보이게
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
    },
  };

  return (
    <Wrapper>
      <Pie data={chartData} options={options} />
    </Wrapper>
  );
};

export default PieChart;

const Wrapper = styled.div`
  width: 300px;
  height: 300px;
  margin: 20px;
`;
