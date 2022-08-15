import moment from 'moment';

const NO_OF_DATAPOINTS = 90;

export const graphs = [
    {
        name: 'Units',
        color: '#00e396',
        yAxis: 0,
        type: 'line',
        dataGrouping: {
          approximation: 'sum',
          units: [['day', [1]]],
        },
    }, {
        name: 'Profit Margin',
        color: '#e3004d',
        yAxis: 1,
        type: 'line',
        dataGrouping: {
          approximation: 'average',
          units: [['day', [1]]],
        },
    }, {
        name: 'Shipping Cost',
        color: '#b59b52',
        yAxis: 2,
        dataGrouping: {
          approximation: 'sum',
          units: [['day', [1]]],
        },
    },{
        name: 'Amz Cost',
        color: '#529eb5',
        yAxis: 2,
        dataGrouping: {
          approximation: 'sum',
          units: [['day', [1]]],
        },
    }
]

export const getGraphData = () => {
    const graphsArray = {...graphs};
    const todayDate = moment();
    let startDate = moment().subtract(NO_OF_DATAPOINTS, 'days');
    const unitsDataPointsArray = []
    const profitMarginDataPointsArray = []
    const shippingCostDataPointsArray = []
    const amzCostPointsArray = []
    while(moment(startDate).isSameOrBefore(todayDate)){
        const xValue = Number(moment(startDate).format('x'));
        const yValueForUnits = Math.floor(Math.random() * 1000);
        unitsDataPointsArray.push({
            x: xValue,
            y: yValueForUnits,
            description: {
                organic: Math.ceil(yValueForUnits/2),
                ppc: Math.floor(yValueForUnits/2)
            }
        });
        profitMarginDataPointsArray.push({
            x: xValue,
            y: Math.random() * 100,
        });
        shippingCostDataPointsArray.push({
            x: xValue,
            y: Math.random() * 100
        })
        amzCostPointsArray.push({
            x: xValue,
            y: Math.random() * 200,
        });
        startDate = startDate.add(1, 'days');
    }
    const array = [unitsDataPointsArray,profitMarginDataPointsArray, shippingCostDataPointsArray, amzCostPointsArray];
    // debugger;
    // graphsArray[1].data = profitMarginDataPointsArray;
    // graphsArray[2].data = shippingCostDataPointsArray;
    // graphsArray[3].data = amzCostPointsArray;
    // debugger;
    return array;
}
