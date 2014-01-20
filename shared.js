String.prototype.appendVisibleNode = function(node, elementName) {
    return this + '\n  <' + node + '>' + $("[name^='" + elementName + "']:visible").val() + '</' + node + '>'
};

String.prototype.appendNode = function(node, elementName) {
    return this + '\n  <' + node + '>' + $("[name='" + elementName + "']").val() + '</' + node + '>'
};

String.prototype.appendNodeWithValue = function(node, value) {
    return this + '\n  <' + node + '>' + value + '</' + node + '>'
};

function getSeries() {
	var series = getSeriesName()
	return $.getJSON('http://www.omdbapi.com/?t=' + series, function(data) { return data });
}

function getEpisode() {
	var imdb = $("[name=IMDB_ID]").val();
	
	if (imdb != '') {   
		return $.getJSON('http://omdbapi.com/?plot=full&i=' + imdb, function(data) { return data });		
	}
	
	return undefined;
}






chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if (msg.action && (msg.action == "createXML")) {
        createXML();
    }
});