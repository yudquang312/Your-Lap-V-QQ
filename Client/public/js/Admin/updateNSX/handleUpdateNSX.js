const NSXId = window.location.search.slice(4);

async function loadNSXDetail() {
    const NSXDetail = await axios.get(`http://localhost:3001/api/v1/nsx/${NSXId}`);
    console.log(NSXDetail);
    $('#producerID').val(NSXDetail.data.nsx._id);
    $('#productNameUp').val(NSXDetail.data.nsx.name);
    $('#nation').val(NSXDetail.data.nsx.nation);
}

$(document).ready(function () {
    loadNSXDetail();
    $('#producerDetails').submit(function (event) {
        event.preventDefault();
        axios.put(`http://localhost:3001/api/v1/nsx/${NSXId}`, {
            name: $('#productNameUp').val(),
            nation: $('#nation').val()
        }).then(res => {
            if (res.status === 200 && alert(res.data.message));
        });
    });
});