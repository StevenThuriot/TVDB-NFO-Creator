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
