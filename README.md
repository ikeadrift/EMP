# EMP
more like NO-tifications

Plan:
- when someone clicks into a comment box, add a action item to
`.UFICommentAttachmentButtons` with an `ajaxify` attribute to toggle notifications for that post
- get the post ID by going from the comment box up to the parent
`[id*="mall_post"]` and then getting the post id from `mall_post_<id>`
- use that post ID in the ajaxify element
- set up a keycommand `ctrl-shift-enter` to submit _and_ turn off notifications
- the EMP icon fades in and out in the new comment box after you ctrl-shift enter
- 