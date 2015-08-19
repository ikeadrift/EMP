'use strict';

function disableKeypressListener() {
  key.unbind('ctrl+shift+enter');
}

function enableKeypressListener(postId) {
  key('ctrl+shift+enter', function() {
    // var ajaxifyElement = $('<a/>', {
    //   rel: 'async-post',
    //   ajaxify: '/ajax/litestand/follow_post?message_id=' + postId + '&follow=0'
    // });

    var ajaxifyElement = $('<a href="#" rel="async-post" ajaxify="/ajax/litestand/follow_post?message_id=883063921763607&amp;follow=1" role="menuitem"><span><span class="_54nh">Turn on notifications</span></span></a>');

    $('body').append(ajaxifyElement);
    ajaxifyElement.trigger('click');
    // ajaxifyElement.remove();
    console.log('clicked');

    disableKeypressListener();
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