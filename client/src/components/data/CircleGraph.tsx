import React from 'react';
// import "reaviz/dist/index.css";
import CanvasJSReact from '../../assets/canvasjs.react';

export function CircleGraph(props: any) {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const options = {
    animationEnabled: true,
    theme: "light1", // "light1", "dark1", "dark2"
    data: [{
      type: "pie",
      indexLabel: "{label}: ${y}",
      startAngle: -90,
      dataPoints: props.data
    }]
  }

  return (
    <CanvasJSChart style={{ margin: 'auto' }} options={options} />
  );
}

export default CircleGraph                            
