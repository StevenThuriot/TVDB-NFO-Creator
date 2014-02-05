String.prototype.isEmpty = function() {
	var trimmedValue = this.replace(/ /gi, '');

	if (trimmedValue.length == 0) return true;
	if (trimmedValue == 'N/A') return true;

	return false;
};

String.prototype.hasValue = function() {
	return !this.isEmpty();
};

String.prototype.trimPipes = function() {
	return this.replace(/^\||\|$/g, '');
};

function getDataByName(name) {
    return $.getJSON('http://www.omdbapi.com/?plot=full&t=' + name, function (data) {
        return data;
    });
}

function getSeries() {
    var series = getSeriesName();
    if (series && series != '') {
        return getDataByName(series);
    }
}

function getEpisode() {
    var imdb = $("[name=IMDB_ID]").val();

    if (imdb && imdb != '') {
        return $.getJSON('http://omdbapi.com/?plot=full&i=' + imdb, function (data) {
            return data;
        });
    }

    imdb = $("[name^='EpisodeName_']:visible").val();

    if (imdb && imdb != '') {
        return getDataByName(imdb);
    }
}

function json2xml(o, tab) {
   var toXml = function(v, name, ind) {
      var xml = '';
       
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += toXml(v[i], name, ind.replace("\t", "") + "\t");
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            else
               hasChild = true;
         }
          
         xml += (hasChild ? ">" : "/>") + '\n';
          
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">\n";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">\n";
      }
      return xml;
   }, xml='<?xml version="1.0" encoding="utf-8"?>\n';
    
   for (var m in o)
      xml += toXml(o[m], m, "");
    
    if (tab)
        xml = xml.replace(/\t/g, tab);
    
   return xml;
}

function getQueryString() {
    var queries = {};
    $.each(document.location.search.substr(1).split('&'),function(c,q){
        var i = q.split('=');
        queries[i[0].toString()] = i[1].toString();
    });
    
    return queries;
}

function saveAsNFO(o) {
	var xml = json2xml(o);
    
    alert(xml); //TODO: Remove
    var blob = new Blob([xml], { type: 'text/xml' }); //application/octet-stream

    if (arguments.length > 1) {
        var filename = arguments[1] + '.nfo';
    } else {
        var filename = 'tvshow.nfo';
    }
    
    saveAs(blob, filename)
    NProgress.done();
    isCreatingInfo = false;
}

var isCreatingInfo = false;
chrome.runtime.onMessage.addListener(function (msg, sender) {    
    if (msg.action && (msg.action === "createInfo")) {
        if (isCreatingInfo) {
            console.log("Already creating an nfo..");
            return;
        }
        
        isCreatingInfo = true;            
        NProgress.start();
        
        createInfo();
    }
});