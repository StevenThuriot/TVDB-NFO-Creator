function getSeriesName() {
	return $(".titlesection > h1:first").text();
}

function createXML() {
	var calls = [getSeries()]
	
	var epCall = getEpisode();	
	if (epCall != undefined) {    
		calls.push(epCall)
	}

	$.when.apply($, calls).then(function(){	
		var seriesJSON;
		
		if (arguments.length > 0) {
			seriesJSON = arguments[0][0]
		} else {
			seriesJSON = { 'Response' : 'False' }
		}

		var episodeJSON;    
		if (arguments.length > 1) {
			episodeJSON = arguments[1][0]
		} else {
			episodeJSON = { 'Response' : 'False' }
		}
		
		var xml = '<?xml version="1.0" encoding="utf-8"?>\n<episodedetails>';
		
		if (episodeJSON && episodeJSON.Response == 'True') {					  
			var title = episodeJSON.Title
		} else { 
			var title = $("[name^='EpisodeName_']:visible").val()
		}
		
		xml = xml.appendNodeWithValue("title", title)
					.appendNode("aired", "FirstAired")
					.appendNode("season", "DVD_season")
					.appendNode("episode", "EpisodeNumber")
					.appendNode("director", "Director")
					.appendNodeWithValue("thumb", $("img.banner").prop('src').replace('/_cache', ''))
					.appendNodeWithValue("credits", $("[name='Writer']").val().replace(/\|/g, " (Writer) / ") + ' (Writer)' + $("[name='GuestStars']").val().replace(/\|/g, ' (Guest Star) / ') + ' (Guest Star) / ');
						
		if (episodeJSON && episodeJSON.Response == 'True') {
			xml = xml.appendNodeWithValue("rating", episodeJSON.imdbRating)
					  .appendNodeWithValue("plot", episodeJSON.Plot)   
		} else {
			xml = xml.appendVisibleNode("plot", "Overview_")
		}
		
		if (seriesJSON && seriesJSON.Response == 'True') {
			$.each(seriesJSON.Actors.split(', '), function(index, value) {
				xml += '\n  <actor>' +
					   '\n    <name>' + value + '</name>' +
					   '\n  </actor>';
			});
		}
		
		xml += '\n</episodedetails>';
		
		saveXML(xml, getSeriesName() + ' - ' + title);
	});
};
