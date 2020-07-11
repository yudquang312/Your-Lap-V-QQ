$(document).ready(function () {
    loadOrderList();
})
async function loadOrderList() {
    const getDataOrders = await axios.get(`http://localhost:3001/api/v1/order`);
    const Orders = getDataOrders.data.listOrder;
    console.log(Orders);
    const getDataOrdersDetail = await axios.get(`http://localhost:3001/api/v1/orderdetail`);
    console.log(getDataOrdersDetail);
    const ordersDetail = getDataOrdersDetail.data.listOrderDetail;
    console.log(ordersDetail);
    $('tbody').empty().append(
        `<tr class="heading">
        <td class="cell-check">
          <!-- <input type="checkbox" class="inbox-checkbox checkbox2"> -->
        </td>
        <td class="cell-icon">
          Mã đơn hàng
        </td>
        <td class="cell-author hidden-phone hidden-tablet">
            Mã khách hàng
        </td>
        <td class="cell-title">
           Tên khách hàng
        </td>
        <td class="cell-icon hidden-phone hidden-tablet">
            Tình trạng
        </td>
        <td class="cell-time align-right">
            Ngày đặt hàng
        </td>
        <td></td>
        <td></td>
    </tr>`
    );
    Orders.forEach(order => {
        $('tbody').append(
            `<tr class='unread'>
                <td class='cell-check'>
                </td>
                <td class='cell-check'>
                    ${order._id}
                </td>
                <td class='cell-icon'>
                    ${order.user._id}
                </td>
                <td class="cell-author hidden-phone hidden-tablet">
                    ${order.recipientName}
                </td>
                <td class="cell-icon hidden-phone hidden-tablet">
                    ${order.state}
                </td>
                <td class="cell-time align-right">
                    ${order.createdAt.slice(0, 10)}
                </td>
                <td>
                    <div class="btn btn-primary pull-right view-${order._id}">
                        Xem
                    </div>
                </td>
                <td>
                    <div class="btn btn-primary pull-right delete-${order._id}">
                        Xóa
                    </div>
                </td>
            </tr>`
        )
        $(`.view-${order._id}`).click(() => {
            // console.log(ordersDetail.find(orderDetail => orderDetail.order._id == order._id)._id);
            redirect(`orderDetails.html?id=${order._id}`)
        });
        $(`.delete-${order._id}`).click(async () => {
            await axios.delete(`http://localhost:3001/api/v1/order/${order._id}`)
                .then(res => {
                    console.log(res);
                    alert(res.data.message);
                });
            await axios.delete(`http://localhost:3001/api/v1/orderdetail/${ordersDetail.find(orderDetail => orderDetail.order._id == order._id)._id}`)
                .then(res => {
                    console.log(res);
                    alert(res.data.message);
                });
            location.reload(true);
        })
    });
}