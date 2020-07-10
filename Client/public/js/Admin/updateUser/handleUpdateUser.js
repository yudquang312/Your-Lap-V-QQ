const userId = window.location.search.slice(4);

async function loadUserDetail() {
    const getData = await axios.get(`http://localhost:3001/api/v1/users/${userId}`);
    const userDetail = getData.data.user;
    console.log(userDetail);
    $('#cusID').val(userDetail._id);
    $('#inputNamePr').val(userDetail.fullname ? userDetail.fullname : '');
    $('#inputEmail3').val(userDetail.dateOfBirth ? userDetail.dateOfBirth.slice(0, 10) : '');
    $('#inputPhoneNumber').val(userDetail.phoneNumber ? userDetail.phoneNumber : '');
    $('#inputAddress').val(userDetail.address ? userDetail.address : '');
    $('#inputDateRegister').val(userDetail.createdAt.slice(0, 10));
    $('#male').checked = false;
    $('#female').checked = false;
    userDetail.gender ? userDetail.gender == 'Nam' ? $('#male').checked = true : $('#female').checked = true : $('#male').checked = true;
}
$(document).ready(function () {
    loadUserDetail();
    $('#userDetails').submit(function (event) {
        // console.log(typeof $('#inputEmail3').val(), $('#inputEmail3').val());
        event.preventDefault();
        axios.put(`http://localhost:3001/api/v1/users/${userId}`, {
            fullname: $('#inputNamePr').val(),
            dateOfBirth: $('#inputEmail3').val(),
            gender: $('#male').is(':checked') ? 'Nam' : 'Nữ',//? chua lay dc gioi tinh
            phoneNumber: $('#inputPhoneNumber').val(),
            address: $('#inputAddress').val()
        }).then(res => {
            if (res.data.message === 'update successful' && alert(res.data.message));
        });
    });
});