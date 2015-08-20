'use strict';
var EMP_SHORTCUT = 'ctrl+shift+enter';


// BRIDGE

function bridge () {
  window.addEventListener('message', function(request) {

    if (request.data !== undefined && request.data.type === 'SubmitComment') {
      var keyboardEvent = document.createEvent('KeyboardEvent');
      var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';


      keyboardEvent[initMethod](
                         'keydown', // event type : keydown, keyup, keypress
                          true, // bubbles
                          true, // cancelable
                          window, // viewArg: should be window
                          false, // ctrlKeyArg
                          false, // altKeyArg
                          false, // shiftKeyArg
                          false, // metaKeyArg
                          13, // keyCodeArg : unsigned long the virtual key code, else 0
                          0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
      );
      window.getSelection().anchorNode.dispatchEvent(keyboardEvent);
      console.log(window.getSelection().anchorNode);
    }

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
        $('#EMP').parents('.UFIInputContainer').find('.UFICommentAttachmentButtons').append('<div style="width: 14px; height: 14px; margin-top: 9px; margin-left: -24px;margin-bottom:4px; background-image:url("chrome.extension.getURL("images/comment-icon.png")");background-size: contain;"></div>').fadeIn().next().delay(500).fadeOut();

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

      window.postMessage({
        type: 'SubmitComment'
      }, window.location.origin);
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
