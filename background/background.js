function checkForValidUrl(tabId, changeInfo, tab) {
    if (/http:\/\/(www.)?thetvdb.com\/\?tab=episode&seriesid=\d+&seasonid=\d+&id=\d+/i.test(tab.url)) {
        chrome.pageAction.show(tabId);
    } else if (/http:\/\/(www.)?thetvdb.com\/\?tab=series&id=\d+/i.test(tab.url)) {
        chrome.pageAction.show(tabId);
    }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { 'action': 'createXML' });
});