Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});

Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});

Meteor.publish('topPosts', function(limit) {
  var sub = this, commentHandles = [], postHandle = null;

  // send over the top two comments attached to a single post
  function publishPostComments(postId) {
    var commentsCursor = Comments.find({postId: postId}, {limit: 2});
    commentHandles[postId] = Mongo.Collection._publishCursor(commentsCursor, sub, 'comments');
  }

  postHandle = Posts.find({}, {limit: limit}).observeChanges({
    added: function(id, post) {
      publishPostComments(id);
      sub.added('posts', id, post);
    },
    changed: function(id, fields) {
      sub.changed('posts', id, fields);
    },
    removed: function(id) {
      // stop observing changes on the post's comments
      commentHandles[id] && commentHandles[id].stop();
      // delete the post
      sub.removed('posts', id);
    }
  });

  sub.ready();

  // make sure we clean everything up (note `_publishCursor`
  //   does this for us with the comment observers)
  sub.onStop(function() { postHandle.stop(); });
});

Meteor.publish("acdqueueAgent", function() {
  return redisCollection.matching("acdqueue:agent:*");
});
