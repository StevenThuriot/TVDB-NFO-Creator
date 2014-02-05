function getSeriesName() {
    return $('#content h1:first').text();
}

function addGenres(details, genres) {
    $.each(genres, function(i, genre) {
        if (details.genre) {
            details.genre.push(genre);
        } else {
            details.genre = [ genre ];   
        }
    });
}

function addActors(details, actors) {
    $.each(actors, function(i, actor) {
        if (details.actor) {
            details.actor.push(actor);
        } else {
            details.actor = [ actor ];   
        }
    });
}

function createInfo() {
    var details = new Object();
    var queries = getQueryString();
        
    if (queries && queries.id) {
        details.id = queries.id;   
    }
    
    var information = $('h1:contains("Information")').parent().find('tr');
    
    NProgress.set(0.2);

    var infoObject = new Object();
    jQuery.each(information, function(key, value) { 
        var topic = jQuery(value).children().first();
        var topicValue = topic.next();
        
        var topicText = topic.text().trim().replace(':', '').trim()
        var topicValueText = topicValue.html()
        
        if (!topicValueText) return true;	
        
        var topicValues = topicValueText.split('<br>');
        
        var tTopic = topicText.replace(' ', '');
        if (topicValues.length == 1) {
            infoObject[tTopic] = topicValues[0].trim();
        } else {	
            jQuery.each(topicValueText.split('<br>'), function(tKey, tValue) {
                tValue = tValue.trim();
                
                if (!infoObject[tTopic]) {
                    infoObject[tTopic] = [ tValue ];
                }
                else {
                    infoObject[tTopic].push(tValue);
                }
            });
        }
    });
    
    details.title = $('#content h1:first').text();
    details.showtitle = details.title;
                
                
    if (infoObject.Network) {
        details.studio = infoObject.Network;
    }
    
    NProgress.set(0.4);
    
    $.when(getSeries()).then(function (data) {        
            NProgress.set(0.7); 
        
            if (data && data.Response == 'True') {    
                details.plot = data.Plot;
                details.premiered = data.Released;
                addGenres(details, data.Genre.split(', '));    
                addActors(details, data.Actors.split(', '));         
                details.rating = data.imdbRating;
                details.votes = data.imdbVotes;
                details.mpaa = data.Rated;
            } else { 
                var plot = $('#content');
                plot.children().remove();
                details.plot = plot.text().trim();
                
                if (infoObject.FirstAired) {
                    details.premiered = infoObject.FirstAired;
                }
                
                if (infoObject.Genre) {                    
                    addGenres(details, infoObject.Genre);
                }
                
                var actors = $('h1:contains("Actors")').parent().find('img')
                if (actors && actors.length > 0) {
                    details.Actor = []
                    $.each(actors, function(key, value) { 
                        var actor = new Object();
                        var parent = $(value).parent();
                        
                        var header2 = parent.find('h2').first();
                        actor.name = header2.text();
                        
                        var headerParent = header2.parent();	
                        actor.role = headerParent.text().split('\n')[3].substring(3);
                        actor.thumb = parent.find('img').first().attr('src');
                        
                        details.Actor.push(actor);
                    });
                }
            }            
        
            NProgress.set(0.9);
    
            var nfo = { tvshow : details };
            saveAsNFO(nfo);
        });
}