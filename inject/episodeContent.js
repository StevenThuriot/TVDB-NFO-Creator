function getSeriesName() {
    return $(".titlesection > h1:first").text();
}

function createInfo() {
    var calls = [getSeries()]

    var epCall = getEpisode();
    
    if (epCall) {
        calls.push(epCall)
    }

    $.when.apply($, calls).then(function () {        
        if (arguments.length > 0 && arguments[0]) {
            var seriesJSON = arguments[0][0]
        }

        if (arguments.length > 1 && arguments[1]) {
            var episodeJSON = arguments[1][0]
        }
        
        var details = new Object();

        if (episodeJSON && episodeJSON.Response == 'True') {
            details.title = episodeJSON.Title
        } else {
            details.title = $("[name^='EpisodeName_']:visible").val()
        }
        
        details.aired = $("[name='FirstAired']").val();
        details.season = $("[name='DVD_season']").val();
        details.episode = $("[name='EpisodeNumber']").val();
        details.director = $("[name='Director']").val();
        details.thumb = $("img.banner").prop('src').replace('/_cache', '');
        details.credits = $("[name='Writer']").val().replace(/\|/g, " (Writer) / ") + ' (Writer)' + $("[name='GuestStars']").val().replace(/\|/g, ' (Guest Star) / ') + ' (Guest Star) / ';


        if (episodeJSON && episodeJSON.Response == 'True') {
            details.rating = episodeJSON.imdbRating;
            details.plot = episodeJSON.Plot;
        } else {
            details.plot = $("[name^='Overview_']:visible").val();
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

        var nfo = { episodedetails : details };
        save(nfo, getSeriesName() + ' - ' + details.title);
    });
};
