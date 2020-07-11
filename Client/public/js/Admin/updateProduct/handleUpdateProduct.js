const productId = window.location.search.slice(4);
async function loadProductDetail() {
    const productDetail = await axios.get(`http://localhost:3001/api/v1/products/${productId}`);
    console.log(productDetail.data.product);
    $('#productID').val(productDetail.data.product._id);
    $('#productNameUp').val(productDetail.data.product.name ? productDetail.data.product.name : '');
    $('#producerIDUp').val(productDetail.data.product.NSX._id);
    $('#typeProductIDUp').val(productDetail.data.product.typeProduct._id);
    $('#entryPriceUp').val(productDetail.data.product.entryPrice ? productDetail.data.product.entryPrice : '');
    $('#sellPriceUp').val(productDetail.data.product.price ? productDetail.data.product.price : '');
    $('#amountUp').val(productDetail.data.product.amount ? productDetail.data.product.amount : '');
    $('#dateUpdateUp').val(productDetail.data.product.updatedAt.slice(0, 10));
    $('#descriptionUp').val(productDetail.data.product.description ? productDetail.data.product.description : '');
}
$(document).ready(function () {
    loadPromotion();
    loadTypeProduct();
    loadNSX();
    loadProductDetail();
    $('#productDetails').submit(function (event) {
        event.preventDefault();
        // alert({
        //     name: $('#productNameUp').val(),
        //     description: $('#descriptionUp').val(),
        //     entryPrice: $('#entryPriceUp').val(),
        //     price: $('#sellPriceUp').val(),
        //     amount: $('#amountUp').val(),
        //     NSX: $('#producerIDUp').val(),
        //     typeProduct: $('#typeProductIDUp').val()
        // });
        axios.put(`http://localhost:3001/api/v1/products/${productId}`, {
            name: $('#productNameUp').val(),
            description: $('#descriptionUp').val(),
            entryPrice: $('#entryPriceUp').val(),
            price: $('#sellPriceUp').val(),
            amount: $('#amountUp').val(),
            NSX: $('#producerIDUp').val(),
            typeProduct: $('#typeProductIDUp').val()
        }).then(res => {
            alert(res.data.message);
        });
    })
});
async function loadTypeProduct() {
    $('#typeProductIDUp').html(`<option value="0">Chọn mã loại sản phẩm</option>`)
    const types = await axios.get('http://localhost:3001/api/v1/type_product');
    console.log(types.data.listPT)
    types.data.listPT.forEach((pt) => {
        $('#typeProductIDUp').append(`
            <option value="${pt._id}">${pt.name}</option>
        `)
    })
}
async function loadNSX() {
    $('#producerIDUp').html(`<option value="0">Chọn mã nhà sản xuất</option>`)
    const nsx = await axios.get('http://localhost:3001/api/v1/nsx');
    console.log(nsx.data.listPT)
    nsx.data.listNSX.forEach((pt) => {
        $('#producerIDUp').append(`
            <option value="${pt._id}">${pt.name}</option>
        `)
    })
}
async function loadPromotion() {
    $("#typeProductIDPromotion").html(`<option value="0">Chọn mã khuyến mãi</option>`);
    const promotion = await axios.get('http://localhost:3001/api/v1/promotion');
    promotion.data.listPromotion.forEach(pt => {
        $("#typeProductIDPromotion").append(`
            <option value="${pt._id}">${pt.name}</option>
        `);
    });
}