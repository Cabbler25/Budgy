import React from 'react';
import { PieArcSeries, PieChart } from 'reaviz';
import "reaviz/dist/index.css";

export function CircleGraph(props: any) {
  return (
    <div style={{ margin: 'auto', maxHeight: '100%' }}>
      <PieChart
        width={350}
        height={250}
        data={props.data}

        series={<PieArcSeries />}
      />
    </div>
  );
}

export default CircleGraph                            
