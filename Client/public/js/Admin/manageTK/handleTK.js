let dataOrder;
let dataOrderDetail;
const materialOptions = {
    chart: {
        title: 'Thống Kê Doanh Thu'
    },
    width: 1000,
    height: 600,
    series: {
        // Gives each series an axis name that matches the Y-axis below.
        0: { axis: 'Doanh Thu' },
        1: { axis: 'Số Lượng Đơn Hàng' }
    },
    axes: {
        // Adds labels to each axis; they don't have to match the axis names.
        y: {
            Temps: { label: 'Doanh Thu' },
            Daylight: { label: 'Số Lượng Đơn Hàng' }
        }
    }
};
$(document).ready(async function () {
    await loadData();
    loadLineChartDay();
    loadTK();
    // test();
});

const loadData = async () => {
    const getDataOrder = await axios.get('http://localhost:3001/api/v1/order');
    dataOrder = getDataOrder.data.listOrder;
    console.log(dataOrder);
}
const loadTK = () => {
    // console.log($('#typeTK').val());
    $('#typeTK').change((event => {
        if ($('#typeTK').val() === 'day') {
            loadLineChartDay();
        } else if ($('#typeTK').val() === 'month') {
            loadLineChartMonth();
        } else if ($('#typeTK').val() === 'quater') {
            loadLineChartQuater();
        } else if ($('#typeTK').val() === 'year') {
            loadLineChartYear();
        }
    }))
}

const loadLineChartDay = () => {
    let sum = 0;
    google.charts.load('current', { 'packages': ['line', 'corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    let chartDiv = document.getElementById('chart_div');
    function drawChart() {

        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Ngày');
        data.addColumn('number', "Doanh Thu");
        data.addColumn('number', "Số Lượng Đơn Hàng");
        const arrDataDoanhThu = [];
        const objFreq = dataOrder.reduce((freq, order) => {
            if (freq[order.createdAt.slice(0, 10)]) {
                freq[order.createdAt.slice(0, 10)][0] += order.total ? order.total : 0;
                freq[order.createdAt.slice(0, 10)][1]++;

            } else {
                freq[order.createdAt.slice(0, 10)] = [order.total, 1];
            }
            sum += order.total ? order.total : 0;
            return freq;
        }, {});
        console.log(objFreq);
        for (let day in objFreq) {
            arrDataDoanhThu.push([day, objFreq[day][0], objFreq[day][1]]);
        }

        data.addRows(arrDataDoanhThu);
        console.log(arrDataDoanhThu);
        console.log(data);
        function drawMaterialChart() {
            let materialChart = new google.charts.Line(chartDiv);
            materialChart.draw(data, materialOptions);
        }
        $('#doanhthu').val(formatMoney(sum));
        drawMaterialChart();
    }
}
const loadLineChartMonth = () => {
    let sum = 0;
    google.charts.load('current', { 'packages': ['line', 'corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    let chartDiv = document.getElementById('chart_div');
    function drawChart() {

        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Tháng');
        data.addColumn('number', "Doanh Thu");
        data.addColumn('number', "Số Lượng Đơn Hàng");
        const arrDataDoanhThu = [];
        const objFreq = dataOrder.reduce((freq, order) => {
            if (freq[+order.createdAt.slice(5, 7)]) {
                freq[+order.createdAt.slice(5, 7)][0] += order.total ? order.total : 0;
                freq[+order.createdAt.slice(5, 7)][1]++;

            } else {
                freq[+order.createdAt.slice(5, 7)] = [order.total, 1];
            }
            sum += order.total ? order.total : 0;
            return freq;
        }, {});
        console.log(objFreq);
        // for (let month in objFreq) {
        //     console.log([month, objFreq[month][0], objFreq[month][1]]);
        //     arrDataDoanhThu.push([month, objFreq[month][0], objFreq[month][1]]);
        // }
        for (let i = 1; i <= 7; i++) {
            if (objFreq[i]) {
                arrDataDoanhThu.push([i + '', objFreq[i][0], objFreq[i][1]]);
            } else {
                arrDataDoanhThu.push([i + '', 0, 0]);
            }
        }

        data.addRows(arrDataDoanhThu);
        console.log(arrDataDoanhThu);
        function drawMaterialChart() {
            let materialChart = new google.charts.Line(chartDiv);
            materialChart.draw(data, materialOptions);
        }
        $('#doanhthu').val(formatMoney(sum));
        drawMaterialChart();
    }
}
const loadLineChartQuater = () => {
    let sum = 0;
    google.charts.load('current', { 'packages': ['line', 'corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    let chartDiv = document.getElementById('chart_div');
    function drawChart() {

        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Quý');
        data.addColumn('number', "Doanh Thu");
        data.addColumn('number', "Số Lượng Đơn Hàng");
        const arrDataDoanhThu = [];
        const objFreq = dataOrder.reduce((freq, order) => {
            if (freq[Math.ceil(+order.createdAt.slice(5, 7) / 3)]) {
                freq[Math.ceil(+order.createdAt.slice(5, 7) / 3)][0] += order.total ? order.total : 0;
                freq[Math.ceil(+order.createdAt.slice(5, 7) / 3)][1]++;

            } else {
                freq[Math.ceil(+order.createdAt.slice(5, 7) / 3)] = [order.total, 1];
            }
            sum += order.total ? order.total : 0;
            return freq;
        }, {});
        console.log(objFreq);
        // for (let quater in objFreq) {
        //     console.log([quater, objFreq[quater][0], objFreq[quater][1]]);
        //     arrDataDoanhThu.push([quater, objFreq[quater][0], objFreq[quater][1]]);
        // }
        for (let i = 1; i <= 3; i++) {
            if (objFreq[i]) {
                arrDataDoanhThu.push([i + '', objFreq[i][0], objFreq[i][1]]);
            } else {
                arrDataDoanhThu.push([i + '', 0, 0]);
            }
        }
        data.addRows(arrDataDoanhThu);
        console.log(arrDataDoanhThu);
        function drawMaterialChart() {
            let materialChart = new google.charts.Line(chartDiv);
            materialChart.draw(data, materialOptions);
        }
        $('#doanhthu').val(formatMoney(sum));
        drawMaterialChart();
    }
}
const loadLineChartYear = () => {
    let sum = 0;
    google.charts.load('current', { 'packages': ['line', 'corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    let chartDiv = document.getElementById('chart_div');
    function drawChart() {

        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Năm');
        data.addColumn('number', "Doanh Thu");
        data.addColumn('number', "Số Lượng Đơn Hàng");
        const arrDataDoanhThu = [];
        const objFreq = dataOrder.reduce((freq, order) => {
            if (freq[order.createdAt.slice(0, 4)]) {
                freq[order.createdAt.slice(0, 4)][0] += order.total ? order.total : 0;
                freq[order.createdAt.slice(0, 4)][1]++;

            } else {
                freq[order.createdAt.slice(0, 4)] = [order.total, 1];
            }
            sum += order.total ? order.total : 0;
            return freq;
        }, {});
        console.log(objFreq);
        arrDataDoanhThu.push(['2019', 0, 0]);
        for (let year in objFreq) {
            console.log([year, objFreq[year][0], objFreq[year][1]]);
            arrDataDoanhThu.push([year, objFreq[year][0], objFreq[year][1]]);
        }

        data.addRows(arrDataDoanhThu);
        console.log(arrDataDoanhThu);
        function drawMaterialChart() {
            let materialChart = new google.charts.Line(chartDiv);
            materialChart.draw(data, materialOptions);
        }
        $('#doanhthu').val(formatMoney(sum));
        drawMaterialChart();
    }
}
function formatMoney(money) {
    money += '';
    let format = '';
    for (let i = 0; i < money.length; i++) {
        if (i % 3 == 0 && i) {
            format = money[money.length - i - 1] + '.' + format;
        } else {
            format = money[money.length - i - 1] + format;
        }
    }
    return format;
}
