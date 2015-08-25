'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  //console.log('previousVersion', details.previousVersion);
});
chrome.cookies.onChanged.addListener(function(info) {
    //console.log("onChanged" + JSON.stringify(info));
});
//chrome.browserAction.setBadgeText({text: '\'Allo'});