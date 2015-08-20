'use strict';

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  // is a comment post
  var buf = new Uint8Array(details.requestBody.raw[0].bytes);
  var qs = ab2str(buf);
  var partial = qs.match(/ft\[top_level_post_id\](.*?)&/g)[0].replace('&', '');
  var postId = partial.split('=')[1];

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {postId: postId});
  });

}, {
  urls: ['*://*.facebook.com/ufi/add/comment/']
}, ['requestBody']);