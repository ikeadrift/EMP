'use strict';

function disableKeypressListener() {
  key.unbind('ctrl+shift+enter');
}

function enableKeypressListener(postId) {
  key('ctrl+shift+enter', function() {

    var AsyncRequest = require('AsyncRequest');
    var unfollowPost = new AsyncRequest('/ajax/litestand/follow_post?follow=0&message_id=' + postId);
    if (unfollowPost.send()) {

      disableKeypressListener();
    }
  });
}

$('body').on('click', function(e) {
  var target = $(e.target);
  if (!target.parents('.UFICommentContainer').length) {
    return;
  }

  var postId = target.parents('[id*="mall_post"]').attr('id').replace('mall_post_', '');

  enableKeypressListener(postId);

  $(e.target).find('[role="combobox"]').on('blur', function() {
    // remove keypress listener
    disableKeypressListener();
  });
});