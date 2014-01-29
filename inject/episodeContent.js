function getSeriesName() {
    return $(".titlesection > h1:first").text();
}

function createInfo() {
    var calls = [getSeries()];

    var epCall = getEpisode();
    
    if (epCall) {
        calls.push(epCall);
    }
    
    NProgress.set(0.2);

    $.when.apply($, calls).then(function () {        
        NProgress.set(0.7);
        
        if (arguments.length > 0 && arguments[0]) {
            var seriesJSON = arguments[0][0];
        }

        if (arguments.length > 1 && arguments[1]) {
            var episodeJSON = arguments[1][0];
        }
        
        var details = new Object();

        if (episodeJSON && episodeJSON.Response == 'True') {
            details.title = episodeJSON.Title;
        } else {
            details.title = $("[name^='EpisodeName_']:visible").val();
        }
        
		var aired = $("[name='FirstAired']").val();
		if (stringHasValue(aired)) {
			details.aired = aired;
		}
		
		var season = $(".titlesection > h2:first").text().replace(/[a-zA-Z ]/ig, '');
		if (stringHasValue(season)) {
			details.season = season;
		}
		
		var episode = $("[name='EpisodeNumber']").val();
		if (stringHasValue(episode)) {
			details.episode = episode;
		}
		
		var director = trimPipes($("[name='Director']").val());
		if (stringHasValue(director)) {
			details.director = director;
		}
		
		var thumb = $("img.banner").prop('src').replace('/_cache', '');
		if (stringHasValue(thumb)) {
			details.thumb = thumb;
		}
		
		var writer = trimPipes($("[name='Writer']").val());
		if (stringHasValue(writer)) {
			writer = writer.replace(/\|/g, " (Writer) / ") + ' (Writer)'
			details.credits = writer;
		}
		
		var guests = trimPipes($("[name='GuestStars']").val());
		if (stringHasValue(guests)) {
			guests = guests.replace(/\|/g, ' (Guest Star) / ') + ' (Guest Star)';
			
			if (stringHasValue(writer)) {
				details.credits += ' / ' + guests;
			} else {
				details.credits = guests;
			}
		}

        if (episodeJSON && episodeJSON.Response == 'True') {
			var rating = episodeJSON.imdbRating;
			if (stringHasValue(rating)) {
				details.rating = rating;
			}
			var plot = episodeJSON.Plot;
        }
				
		if (!plot || plot == 'N/A' || isEmptyString(plot)) {
			var tvdbplot = $("[name^='Overview_']:visible").val();
			if (stringHasValue(tvdbplot)) {
				details.plot = tvdbplot;
			}
		} else {
			details.plot = plot;
		}
        
        if (seriesJSON && seriesJSON.Response == 'True') {
            $.each(seriesJSON.Actors.split(', '), function (index, value) {
                var actor = { name : value };
                
                if (details.actor) {
                   details.actor.push(actor);
                } else {
                    details.actor = [ actor ]
                }
            });
        }
        
        NProgress.set(0.9);

        var nfo = { episodedetails : details };        
        save(nfo, getSeriesName() + ' - ' + details.title);
    });
}