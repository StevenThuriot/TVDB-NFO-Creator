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

        if (episodeJSON && episodeJSON.Response == 'True' && episodeJSON.Title) {
            details.title = episodeJSON.Title;
        } else {
            var parsedTitle = $("[name^='EpisodeName_']:visible").val();
            
            if (!parsedTitle) {
            	parsedTitle = $(".titlesection > h3:first").text().split(': ')[1];
            }
            
            if (parsedTitle) {
            	details.title = $("[name^='EpisodeName_']:visible").val();
            }
        }
        
		var aired = $("[name='FirstAired']").val();
		if (aired.hasValue()) {
			details.aired = aired;
		}
		
		var season = $(".titlesection > h2:first").text().replace(/[a-zA-Z ]/ig, '');
		if (season.hasValue()) {
			details.season = season;
		}
		
		var episode = $("[name='EpisodeNumber']").val();
		if (episode.hasValue()) {
			details.episode = episode;
		}
		
		var director = $("[name='Director']").val().trimPipes();
		if (director.hasValue()) {
			details.director = director;
		}
		
		var thumb = $("img.banner").prop('src').replace('/_cache', '');
		if (thumb.hasValue()) {
			details.thumb = thumb;
		}
		
		var writer = $("[name='Writer']").val().trimPipes();
		if (writer.hasValue()) {
			writer = writer.replace(/\|/g, " (Writer) / ") + ' (Writer)'
			details.credits = writer;
		}
		
		var guests = $("[name='GuestStars']").val().trimPipes();
		if (guests.hasValue()) {
			guests = guests.replace(/\|/g, ' (Guest Star) / ') + ' (Guest Star)';
			
			if (writer.hasValue()) {
				details.credits += ' / ' + guests;
			} else {
				details.credits = guests;
			}
		}

        if (episodeJSON && episodeJSON.Response == 'True') {
			var rating = episodeJSON.imdbRating;
			if (rating.hasValue()) {
				details.rating = rating;
			}
			var plot = episodeJSON.Plot;
        }
				
		if (!plot || plot == 'N/A' || plot.isEmpty()) {
			var tvdbplot = $("[name^='Overview_']:visible").val();
			if (tvdbplot.hasValue()) {
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
		saveAsNFO(nfo, getSeriesName() + ' - ' + details.title);
    });
}
