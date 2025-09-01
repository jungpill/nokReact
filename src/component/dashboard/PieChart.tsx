import React, {useState, useEffect} from "react";
import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";
import { getTopSearchKeywords, getAnalytics } from "../../service/dashboard";
import test from '../../assets/react.svg';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface Props {
    selectedGroupId: string
}

const PieChart: React.FC<Props> = ({selectedGroupId}) => {

  const [data, setData] = useState<{ text: string; search_count: number }[]>([]);  
  const total = data.reduce((acc, cur) => acc + cur.search_count, 0);

  const chartData = {
    labels: data.map((item) => item.text),
    datasets: [
      {
        data: data.map((item) =>
          ((item.search_count / total) * 100).toFixed(0) // 퍼센트
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
      maintainAspectRatio: false,
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
            const label = context.chart.data.labels?.[context.dataIndex] || "";

            // 1) 작은 비율이면 표시 안함
            if (value < 7) return "";

            // 2) 글자가 4자 초과면 말줄임 처리
            if (label.length > 4) {
            return label.substring(0, 4) + "...";
            }

            return label;
        },
        },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
            const result = await getTopSearchKeywords(selectedGroupId);
        if (result) {
            setData(result);
        }}catch(err){
            console.log(err)
        }
    };
    fetchData();
  }, [selectedGroupId]);



  return (
    <Wrapper>
      {data.length > 0 ? <Pie data={chartData} options={options} /> : <img src={test} alt="test" style={{width: '100%', height: '100%'}}/>}
    </Wrapper>
  );
};

export default PieChart;

const Wrapper = styled.div`
    width: 100%;
    height: 280px;
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
    background: #f9f9f9;
    border-radius: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 200px;
    height: 30px;
    padding: 3px 5px;
    width: 100%;

    &:hover {
        background-color: 
    }
`
