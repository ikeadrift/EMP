'use strict';

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

var regexes = [
  new RegExp('ft_ent_identifier=(.*?)&', 'g'),
  new RegExp('ft\\[top_level_post_id\\](.*?)&', 'g')
];

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  // is a comment post
  var buf = new Uint8Array(details.requestBody.raw[0].bytes);
  var qs = ab2str(buf);

  var m;
  for (var i=0; i < regexes.length; i++) {
    m = qs.match(regexes[i]);
    if (m.length === 1) {
      break;
    }
  }

  if (m === undefined) {
    // couldn't get it
    return;
  }

  var partial = m[0].replace('&', '');
  var postId = partial.split('=')[1];

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {postId: postId});
  });

}, {
  urls: ['*://*.facebook.com/ufi/add/comment/*']
}, ['requestBody']);