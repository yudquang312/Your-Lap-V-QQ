$(document).ready(function () {
    $('#uploadProduct').submit(function (event) {
        event.preventDefault();
        axios.post(`http://localhost:3001/api/v1/products`, {
            name: $('#name').val(),
            typeProduct: $('select[name="typeProduct"]').val(),
            NSX: $('select[name="NSX"]').val(),
            amount: $('#amount').val(),
            entryPrice: $('#entryPrice').val(),
            price: $('#price').val()
        }).then(res => {
            console.log(res);
            alert(res.data.message);
        });
    })
})