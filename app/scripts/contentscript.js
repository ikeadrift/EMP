'use strict';
var EMP_SHORTCUT = 'shift+enter';


// BRIDGE

function bridge() {

  window.addEventListener('message', function(request) {

    if (request.data !== undefined && request.data.type === 'AsyncRequest') {
      console.log(request.data.endpoint);

      var AsyncRequest = require('AsyncRequest');
      var unfollowPost = new AsyncRequest(request.data.endpoint);
      unfollowPost.send();
    }

  }, false);
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ bridge +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

// END BRIDGE

$(document).ready(function() {

  var listenForCommentPost = false;

  chrome.runtime.onMessage.addListener(function(request) {
    if (request.postId !== undefined) {
      if (listenForCommentPost) {
        window.postMessage({
          type: 'AsyncRequest',
          endpoint: '/ajax/litestand/follow_post?follow=0&message_id=' + request.postId
        }, window.location.origin);

        disableKeypressListener();
      }
    }
  });

  function disableKeypressListener() {
    key.unbind(EMP_SHORTCUT);
    listenForCommentPost = false;
  }

  function enableKeypressListener() {
    key(EMP_SHORTCUT, function() {
      listenForCommentPost = true;
    });
  }

  function onFocus(e) {
    var target = $(e.target);
    target.attr('id', 'EMP');
    enableKeypressListener();
    target.on('blur', disableKeypressListener);
  }

  var observer = new MutationObserver(function(mutations) {
    for(var mut in mutations) {
      var mutation = mutations[mut];
      if (mutation.addedNodes.length > 0) {
        for (var i in mutation.addedNodes) {
          var node = mutation.addedNodes[i];
          if (node && node.nodeType === 1) {
            $('[role="combobox"]').off('focus', null, onFocus);
            $('[role="combobox"]').on('focus', null, onFocus);
          }
        }
      }
    }
  });
  observer.observe(document.getElementById('facebook'), {
    subtree: true,
    childList: true,
    attributes: false
  });
});
