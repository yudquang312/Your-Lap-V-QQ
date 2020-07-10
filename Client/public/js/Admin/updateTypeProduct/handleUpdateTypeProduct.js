const typeProductId = window.location.search.slice(4);
async function loadProductDetail() {
    const typeProductDetail = await axios.get(`http://localhost:3001/api/v1/type_product/${typeProductId}`);
    console.log(typeProductDetail);
    $('#productTypeID').val(typeProductDetail.data.pt._id);
    $('#productNameType').val(typeProductDetail.data.pt.name ? typeProductDetail.data.pt.name : '');
}
$(document).ready(function () {
    loadProductDetail();
    $('#producttype').submit(function (event) {
        event.preventDefault();
        axios.put(`http://localhost:3001/api/v1/type_product/${typeProductId}`, {
            name: $('#productNameType').val(),
        }).then(res => {
            console.log(res);
            alert(res.data.message);
        });
    })
});