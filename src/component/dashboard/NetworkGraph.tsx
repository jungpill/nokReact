import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { GraphChart } from 'echarts/charts';
import { LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { networkData } from './networkData';

echarts.use([GraphChart, LegendComponent, CanvasRenderer]);

type RawNode = { id: string; color?: string; size?: number };
type RawLink = { source: string; target: string; strength: number };
type RawData = { node: RawNode[]; link: RawLink[] };

function scale(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (inMax === inMin) return (outMin + outMax) / 2;
  return outMin + ((v - inMin) * (outMax - outMin)) / (inMax - inMin);
}

function buildFrom(raw: RawData) {
  const nodes: any[] = [];
  const links: any[] = [];

  // 노드 변환
  const sizes = raw.node.map(n => n.size ?? 1);
  const sMin = Math.min(...sizes);
  const sMax = Math.max(...sizes);

  const id2idx = new Map<string, number>();
  raw.node.forEach((n, i) => {
    const symbolSize = Math.round(scale(n.size ?? 1, sMin, sMax, 8, 28));
    nodes.push({
      name: n.id,
      value: n.size ?? 1,
      symbolSize,
      itemStyle: n.color ? { color: n.color } : undefined,
      // 작은 노드는 라벨 숨기고 싶으면 show: symbolSize >= 16 로 바꿔
      label: { show: true },
    });
    id2idx.set(n.id, i);
  });

  // 링크 변환 (문자 id -> 인덱스, strength 매핑)
  const strengths = raw.link.map(l => l.strength);
  const stMin = Math.min(...strengths);
  const stMax = Math.max(...strengths);

  const threshold = 0.05; // 너무 약한 링크 제거 (원하면 0으로)
  const seen = new Set<string>(); // 중복 방지

  for (const l of raw.link) {
    if (!id2idx.has(l.source) || !id2idx.has(l.target)) continue;
    if (l.strength <= threshold) continue;

    const a = id2idx.get(l.source)!;
    const b = id2idx.get(l.target)!;
    const [x, y] = a < b ? [a, b] : [b, a];
    const key = `${x}-${y}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const value = scale(l.strength, stMin, stMax, 1, 5); // 긴/짧은 엣지 매핑용
    const opacity = 0.12 + 0.28 * (value - 1) / 4;     // 강할수록 진하게

    links.push({
      source: x,
      target: y,
      value,
      lineStyle: { opacity, curveness: Math.random() * 0.12 },
    });
  }

  return { nodes, links };
}

export default function NetworkGraph() {
  const { nodes, links } = buildFrom(networkData);
  console.log('asdasd')
  const option = {
    backgroundColor: 'transparent',
    legend: { show: false },
    series: [{
      type: 'graph',
      layout: 'force',
      roam: true,
      draggable: true,
      zoom: 1.1,                  
      nodeScaleRatio: 0.5,         
      label: {
        show: true,
        position: 'bottom',
        offset: [0, 8],
        color: '#000',
        fontWeight: 700,
        formatter: '{b}',          // name 표시
      },
      lineStyle: { width: 1, color: 'rgba(0,0,0,0.25)' },
      emphasis: { lineStyle: { width: 1.6, opacity: 0.35 } },
      force: {
        repulsion: 180,            // 밀도: 140~220에서 조절
        edgeLength: [24, 160],     // link.value=1 → 24, =5 → 160 근처
        friction: 0.25,
        gravity: 0.05,
      },
      data: nodes,
      links,
    }]
  };

  return <ReactEChartsCore echarts={echarts} option={option} style={{ width: '100%', height: 520 }} />;
}