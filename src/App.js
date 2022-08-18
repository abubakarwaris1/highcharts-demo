import React, { useRef, useEffect } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';

import './App.css';
import { getGraphData, series } from './utils/data';

function App() {
  const chartRef = useRef(null);

  const graphOptions = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'column',
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%b %e',
        week: '%e. %b',
        month: "%b '%y",
      },
    },
    yAxis:[{
      gridLineWidth: 1,
      labels: {
        format: '{value}',
      },
      title: {
        text: 'No of Units',
      },
    }, {
      gridLineWidth: 1,
      title: {
        text: 'Profit Margin',
      },
      labels: {
        format: '{value}%',
      },
      opposite:true
    }, {
      
        title: {
          text: 'Amount',
        },
        labels: {
          format: '{value}$',
        },
        opposite: true
    }],
    legend: {
      align: 'center',
      verticalAlign: 'top',
      y: 10,
      floating: true,
      backgroundColor: 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false,
    },
    tooltip: {
      formatter: function (this:any) {
        let formattedString = '<table>';

        this.points.forEach((point, index) => {
          const seriesName = point.series.name;
          const value = point.y;
          if (seriesName === 'Profit Margin') {
            formattedString = `${formattedString}<tr><td><span style="color:${
              point.series.color
            }">${seriesName}:</span> <b></td><td> ${value.toFixed(
              2
            )}% </b></td></tr>`;
          } else if (seriesName === 'Units') {
            let organic = 0;
            let ppc = 0;

            if (point?.point?.dataGroup?.start) {
              const { start, length } = point.point.dataGroup;
              for (let i = 0; i < length; i += 1) {
                organic +=
                  point.series.userOptions.data[start + i].description.organic;
                ppc += point.series.userOptions.data[start + i].description.ppc;
              }
            } else {
              const pointIndex = point.point.index;
              const description =
                point.series.userOptions.data[pointIndex].description;
              if (description) {
                organic = description.organic;
                ppc = description.ppc;
              }
            }

            const shouldConvertToTwoDecimalPlaces =
              seriesName === 'Units' ? false : true;
            formattedString = `${formattedString}<tr><td><span style="color:${
              point.series.color
            }">${seriesName}:</span> <b></td><td>${
              shouldConvertToTwoDecimalPlaces ? value.toFixed(2) : value
            } </b></span></td></tr>`;

            formattedString = `${formattedString}<tr><td><span style="marginLeft:10px;color:${
              point.series.color
            }">Organic: <b></td><td>${
              shouldConvertToTwoDecimalPlaces ? organic.toFixed(2) : organic
            }</b></span></td></tr>`;

            formattedString = `${formattedString}<tr><td><span style="marginLeft:10px;color:${
              point.series.color
            }">PPC: <b></td><td>${
              shouldConvertToTwoDecimalPlaces ? ppc.toFixed(2) : ppc
            }</b></span></td></tr>`;
          } else {
            const shouldConvertToTwoDecimalPlaces =
              seriesName === 'Stock' ? false : true;
            formattedString = `${formattedString}<tr><td><span style="color:${
              point.series.color
            }">${seriesName}:</span> <b></td><td> ${
              shouldConvertToTwoDecimalPlaces ? value.toFixed(2) : value
            }$</b></span></td></tr>`;
          }
        });
        formattedString += '</table>';

        const dateString = `<b> ${moment(this.x).format(
          'YYYY-MM-DD'
        )} </b><br/><br/> `;

        return `${dateString}${formattedString}`;
      },
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false,
        },
      },
      line: {
        marker: false,
      },
      series: {
        type: 'spline',
        dataGrouping: {
          forced: true,
          units: [['week', [1]]],
        },
      },
    },
    series: series,
  };

  useEffect(() => {
    if (chartRef?.current?.chart) {
      const data = getGraphData();
      const chart = chartRef.current.chart;
      chart.showLoading();
      chart.series.forEach((seriesObj, index) => {
        seriesObj.setData(data[index]);
      });

      chart.redraw();
      chart.hideLoading();
    }
  },[]);

  const onGroupingChange = (dataGroupingValue) => {
    if (chartRef?.current?.chart) {
      const chart = chartRef.current.chart;
      chart.showLoading();
      chart.series.forEach((seriesObj) => {
        seriesObj.update(
          {
            dataGrouping: {
              units: [[dataGroupingValue, [1]]],
              enabled: true,
              forced: true,
            },
          },
          true
        );
      });

      chart.redraw();
      chart.hideLoading();
    }
  };

  return (
    <div className="App">
      <h2>Draw multi graph with custom tooltip in react using functional components.</h2>
      <select 
      onChange={(e) => onGroupingChange(e.target.value)}
      >
        <option value={'day'}>daily</option>
        <option value={'week'}>weekly</option>
        <option value={'month'}>monthly</option>
        <option value={'year'}>yearly</option>
      </select>
      <div>
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={graphOptions}
        />
      </div>
    </div>
  );
}

export default App;
