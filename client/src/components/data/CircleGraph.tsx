import React from 'react';
// import { Pie, PieChart, Tooltip } from "recharts";
import { colorTypes } from '../../assets/Colors';
import { PieChart, PieArcSeries } from 'reaviz';

const data01 = [{ name: 'Group A', value: 1000 }, { name: 'Group B', value: 300 },
{ name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
{ name: 'Group E', value: 278 }, { name: 'Group F', value: 189 }]

export function CircleGraph(props: any) {
  const renderLabel = (entry: any) => {
    console.log(entry.name);
    return entry.name;
  }
  return (
    // <div style={{ textAlign: 'center' }}>
    //   <PieChart style={{ display: 'inline-block' }} width={500} height={400}>
    //     <Pie dataKey="value"
    //       isAnimationActive={false}
    //       data={data01}
    //       cx={250} cy={200}
    //       outerRadius={150}
    //       fill={colorTypes.primary}
    //       label={e => e.name} />
    //     <Tooltip />
    //   </PieChart>
    // </div>
    <div style={{ margin: 'auto', maxHeight: '100%' }}>
        <PieChart
          width={350}
          height={250}
          data={[
            { key: 'Phishing Attack', data: 10 },
            { key: 'IDS', data: 14 },
            { key: 'Malware', data: 5 },
          ]}
          series={<PieArcSeries />}
        />
    </div>
  );
}

export default CircleGraph                            
