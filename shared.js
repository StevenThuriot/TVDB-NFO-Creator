String.prototype.appendVisibleNode = function(node, elementName) {
	return this + '\n  <' + node + '>' + $("[name^='" + elementName + "']:visible").val() + '</' + node + '>'
};

String.prototype.appendNode = function(node, elementName) {
	return this + '\n  <' + node + '>' + $("[name='" + elementName + "']").val() + '</' + node + '>'
};

String.prototype.appendNodeWithValue = function(node, value) {
	return this + '\n  <' + node + '>' + value + '</' + node + '>'
};

function getDataByName(name) {
	return $.getJSON('http://www.omdbapi.com/?plot=full&t=' + name, function(data) { return data });
}

function getSeries() {
	var series = getSeriesName();
	return getDataByName(series);
}

function getEpisode() {
	var imdb = $("[name=IMDB_ID]").val();
	
	if (imdb != '') {   
		return $.getJSON('http://omdbapi.com/?plot=full&i=' + imdb, function(data) { return data });
	}
	
	imdb =  $("[name^='EpisodeName_']:visible").val();
	
	if (imdb != '') {   
		return getDataByName(imdb);
	}
	
	return undefined;
}

function saveXML(xml) {
	alert(xml); //TODO: Remove
	var blob = new Blob([xml], { type: 'text/xml' }); //application/octet-stream 
	
	if (arguments.length > 1) {
		var filename = arguments[1] + '.nfo';
	} else {		
		var filename = 'tvshow.nfo';
	}
	
	saveAs(blob, filename)
}











chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if (msg.action && (msg.action == "createXML")) {
        createXML();
    }
});