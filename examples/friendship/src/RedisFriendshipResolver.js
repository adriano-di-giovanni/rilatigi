export default class RedisFriendshipResolver {
  constructor (client) {
    this._client = client
  }

  start (friends) {
    const multi = this._client.multi()
    friends
      .forEach(me => {
        let myFriends = []
        friends.forEach(friend => friend !== me && myFriends.push(friend, 1))
        multi.hmset(me, ...myFriends)
      })
    return multi.exec()
  }

  end (friends) {
    const multi = this._client.multi()
    friends.forEach(me => multi.hdel(me, ...friends))
    return multi.exec()
  }

  get (me) {
    return this._client.hkeys(me)
  }

  sync (me, friends) {
    let myFriends = []
    friends.forEach(friend => friend !== me && myFriends.push(friend, 1))
    return this._client.hmset(me, ...myFriends)
  }
}
