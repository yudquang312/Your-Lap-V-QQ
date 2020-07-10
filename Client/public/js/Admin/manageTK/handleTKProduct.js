let dataOrder;
let dataOrderDetail;

$(document).ready(async function () {
    await loadData();
    loadCollumnChart();
});

const loadData = async () => {
    const getDtaOrderDetail = await axios.get('http://localhost:3001/api/v1/orderdetail');
    dataOrderDetail = getDtaOrderDetail.data.listOrderDetail;
    console.log(dataOrderDetail);

}
const laodTypeTK = async () => {
    $('#typeTK').change((event => {
        if ($('#typeTK').val() == 'gi do') {

        }
    }))
}
const loadCollumnChart = () => {
    let sum = 0;
    google.charts.load('current', { 'packages': ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawStuff);

    function drawStuff() {

        let button = document.getElementById('change-chart');
        let chartDiv = document.getElementById('chart_div');

        const freqProduct = dataOrderDetail.reduce((freq, orderDetail) => {
            // console.log(orderDetail);
            orderDetail.products.reduce((freq, product) => {
                if (freq[product.productId]) {
                    freq[product.productId][0] += product.amount;
                    freq[product.productId][1] += product.amount * product.price;
                } else {
                    freq[product.productId] = [product.amount, product.amount * product.price];
                }
                sum += product.amount * product.price;
                return freq;
            }, freq);
            return freq;
        }, {});
        // console.log(freqProduct);
        const arrDataProduct = [['Mã SP', 'Doanh Thu', 'Số Lượng']];
        for (let productId in freqProduct) {
            // console.log(productId, freqProduct[productId][1], freqProduct[productId][0]);
            arrDataProduct.push([productId.slice(15), freqProduct[productId][1], freqProduct[productId][0]]);
        }
        let data = google.visualization.arrayToDataTable(arrDataProduct);

        let materialOptions = {
            width: 900,
            chart: {
                title: 'Thống Kê Doanh Thu Từng Sản Phẩm',
                subtitle: ' '
            },
            series: {
                0: { axis: 'Doanh Thu' }, // Bind series 0 to an axis named 'distance'.
                1: { axis: 'Số Lượng' } // Bind series 1 to an axis named 'brightness'.
            },
            axes: {
                y: {
                    distance: { label: 'Doanh Thu' }, // Left y-axis.
                    brightness: { side: 'right', label: 'Số Lượng' } // Right y-axis.
                }
            }
        };

        let classicOptions = {
            width: 900,
            series: {
                0: { targetAxisIndex: 0 },
                1: { targetAxisIndex: 1 }
            },
            title: 'Thống Kê Doanh Thu',
            vAxes: {
                // Adds titles to each axis.
                0: { title: 'Doanh Thu' },
                1: { title: 'Số Lượng' }
            }
        };

        function drawMaterialChart() {
            let materialChart = new google.charts.Bar(chartDiv);
            materialChart.draw(data, google.charts.Bar.convertOptions(materialOptions));
            button.innerText = 'Change to Classic';
            button.onclick = drawClassicChart;
        }

        function drawClassicChart() {
            let classicChart = new google.visualization.ColumnChart(chartDiv);
            classicChart.draw(data, classicOptions);
            button.innerText = 'Change to Material';
            button.onclick = drawMaterialChart;
        }
        $('#doanhthu').val(formatMoney(sum));
        drawMaterialChart();
    };
}
function formatMoney(money) {
    let ans = '';
    let strMoney = [...(money + '')].reverse();
    for (let i = 0; i < strMoney.length; i++) {
        if (i % 3 == 0 && i) {
            ans += '.';
        }
        ans += strMoney[i];
    }
    return [...ans].reverse().join('');
}

