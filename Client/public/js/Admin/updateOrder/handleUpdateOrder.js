const orderId = window.location.search.slice(4);

async function loadOrderDetail() {
	const resBody = await axios.get(`http://localhost:3001/api/v1/orderdetail/${orderId}`);
	const orderDetail = resBody.data.orderDetail;
	console.log(orderDetail);
	$('#orderDetailID').val(orderDetail._id);
	$('#cusID').val(orderDetail.order.user);
	$('#cusNameor').val(orderDetail.order.recipientName ? orderDetail.order.recipientName : '');
	$('#recipientPhone').val(orderDetail.order.recipientPhone ? orderDetail.order.recipientPhone : '');
	$('#cusEmailor').val('khong co field nay');
	$('#recipientAddress').val(orderDetail.order.recipientAddress ? orderDetail.order.recipientAddress : '');
	$('#orderState').val(orderDetail.order.state);
	$('#deliveryDateOr').val();
	$('#inputEmail3').val(orderDetail.order.updatedAt.slice(0, 10));
	$('#total').val(orderDetail.order.total ? orderDetail.order.total : 0);
	$('tbody').empty().append(
		`
		<tr class="headingOrder">
			<td class="cell-icon headingtd">
				Mã sản phẩm
			</td>
			<td class="cell-author headingtd hidden-phone hidden-tablet">
				Tên sản phẩm
			</td>
			<td class="cell-title headingtd">
				Số lượng
			</td>
			<td class="cell-icon headingtd hidden-phone hidden-tablet">
				Đơn giá
			</td>

		</tr>
		`
	)
	for (let i = 0; i < orderDetail.products.length; i++) {
		let getProduct = await axios.get(`http://localhost:3001/api/v1/products/${orderDetail.products[i].productId}`)
		let productName = getProduct.data.product.name;
		$('tbody').append(
			`<tr class="unread">
            <td class="cell-check">
              ${orderDetail.products[i].productId}
            </td>
            <td class="cell-icon">
              ${productName}
            </td>
            <td class="cell-author hidden-phone hidden-tablet">
              ${orderDetail.products[i].amount}
            </td>

            <td class="cell-icon hidden-phone hidden-tablet">
              ${orderDetail.products[i].price}
            </td>

          </tr>`
		)
	}
	//fill data
}

$(document).ready(function () {
	loadOrderDetail();
	$('#orderDetails').submit(function (event) {
		event.preventDefault();
		axios.put(`http://localhost:3001/api/v1/order/${orderId}`, {
			//data
			state: $('#orderState').val()
		}).then(res => {
			console.log(res);
			if (res.status === 200 && alert(res.data.message));
		});
	})
})