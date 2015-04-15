https://github.com/meteor/meteor/

[Meteor中文学习](http://zh.discovermeteor.com/)

```bash
$ meteor add slava:redis-livedata
$ env REDIS_CONFIGURE_KEYSPACE_NOTIFICATIONS=1 REDIS_URL=redis://username:password@127.0.0.1:6379 meteor
```

redis-cli: `CONFIG SET notify-keyspace-events AKE`