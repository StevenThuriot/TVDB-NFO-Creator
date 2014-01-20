
function getSeriesName() {
	return $('#content h1:first').text();
}

function createXML() {
	$.when(getSeries()).then(function(data) {
		alert(JSON.stringify(data));
	});
}