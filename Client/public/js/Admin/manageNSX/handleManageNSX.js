$(document).ready(function () {
	loadNSXList();
})

async function loadNSXList() {
	const getDataNSX = await axios.get(`http://localhost:3001/api/v1/nsx`);
	const NSXs = getDataNSX.data.listNSX;
	$('tbody').empty().append(
		`<tr class="heading typeproduc">
        <td class="cell-time align-right">
          <!-- <input type="checkbox" class="inbox-checkbox checkbox2"> -->
        </td>
        <td class="cell-check">
          Mã nhà sản xuất
        </td>
        <td class="cell-icon">
          Tên nhà sản xuất
        </td>
        <td class="cell-author hidden-phone hidden-tablet">
          Quốc gia
        </td>
        <td>
          
        </td>
        <td>
          
        </td>

      </tr>`
	);
	NSXs.forEach(nsx => {
		$('tbody').append(
			`<tr class='unread'>
                <td class='cell-check'>
                </td>
                <td class='cell-check'>
                    ${nsx._id}
                </td>
                <td class='cell-icon'>
                    ${nsx.name}
                </td>
                <td class="cell-author hidden-phone hidden-tablet">
                    ${nsx.nation}
                </td>
                <td>
                    <div class="btn btn-primary pull-right view-${nsx._id}">
                        Xem
                    </div>
                </td>
                <td>
                    <div class="btn btn-primary pull-right delete-${nsx._id}">
                        Xóa
                    </div>
                </td>
            </tr>`
		)
		$(`.view-${nsx._id}`).click(() => {
			redirect(`producerDetails.html?id=${nsx._id}`)
		});
		$(`.delete-${nsx._id}`).click(async () => {
			await axios.delete(`http://localhost:3001/api/v1/nsx/${nsx._id}`)
				.then(res => {
					alert(res.data.message);
				});
			location.reload(true);
		})
	});
}