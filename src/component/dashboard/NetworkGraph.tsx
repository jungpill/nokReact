import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { GraphChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';


type GraphBuilt = {
  nodes: any[];
  links: any[];
  categories: { name: string }[];
};

echarts.use([GraphChart, TooltipComponent, LegendComponent, CanvasRenderer]);

function buildSampleGraph(): GraphBuilt {

  const cats = [
    { key: "학습",  color: "#22d3ee" }, // 청록
    { key: "관계",  color: "#34d399" }, // 그린
    { key: "감정",  color: "#a78bfa" }, // 보라
    { key: "기술",  color: "#60a5fa" }, // 블루
  ];

  const nodes: any[] = [];
  const links: any[] = [];

  // 카테고리 허브 4개
  const hubNames: string[] = [];
  cats.forEach((c,) => {
    const hub = `${c.key} 허브`;
    hubNames.push(hub);
  });

  // 각 카테고리별 리프 노드 수(합 95) → 총 100개
  const counts = [24, 24, 24, 23];

  // 리프 노드 생성 + 링크
  cats.forEach((c, i) => {
    const hub = hubNames[i];
    for (let k = 1; k <= counts[i]; k++) {
      const name = `${c.key}-${String(k).padStart(2, "0")}`;
      const size = 8 + Math.round(Math.random() * 14); // 8~22
      nodes.push({
        name,
        value: size,
        symbolSize: size,
        itemStyle: { color: c.color },
        label: { show: true}
      });

      // 기본: 허브에 연결
      links.push({ source: name, target: hub });

      // 가끔 다른 허브로도 연결(크로스 엣지)
      if (Math.random() < 0.18) {
        const other = hubNames[(i + 1 + Math.floor(Math.random() * 3)) % 4];
        links.push({ source: name, target: other });
      }
    }
  });

  // 허브들끼리도 느슨하게 연결
  for (let i = 0; i < hubNames.length; i++) {
    for (let j = i + 1; j < hubNames.length; j++) {
      links.push({
        source: hubNames[i],
        target: hubNames[j],
        lineStyle: { opacity: 0.15 }
      });
    }
  }

  return { nodes, links, categories: cats.map(c => ({ name: c.key })) };
}


const NetworkGraph = () => {

  const { nodes, links, categories } = buildSampleGraph();

  console.log('dasdasd2232322')

  const option = {
    backgroundColor: 'transparent',
    tooltip: { show: true },
    legend: { show: false },
    series: [{
      type: 'graph',
      layout: 'force',
      roam: true,
      draggable: true,
      zoom: 0.5,
      label: { color: '#000', fontWeight: 700, position: 'bottom', offset: [0,8] },
      categories,
      force: { repulsion: 300, edgeLength: [40, 120], friction: 0.2 },
      lineStyle: { width: 1, color: 'rgba(255,255,255,0.25)' },
      data: nodes,
      links,
    }]
  };

  return <ReactEChartsCore echarts={echarts} option={option} style={{ width:'100%', height:520 }} />;
}

export default NetworkGraph