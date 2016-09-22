export default class MongoFriendshipResolver {
  constructor (db) {
    this._collection = db.collection('users')
  }

  start (friends) {
    const operations = []
    friends.forEach(me => {
      const myFriends = friends.filter(friend => friend !== me)
      const filter = {
        name: me
      }
      const update = {
        $set: {
          name: me
        },
        $addToSet: {
          friends: {
            $each: myFriends
          }
        }
      }
      const operation = { updateOne: { filter, update, upsert: true } }
      operations.push(operation)
    })
    return this._collection.bulkWrite(operations)
  }

  end (friends) {
    const operations = []
    friends.forEach(me => {
      const filter = {
        name: me
      }
      const update = {
        $set: {
          name: me
        },
        $pull: {
          friends: {
            $in: friends
          }
        }
      }
      const operation = { updateOne: { filter, update, upsert: true } }
      operations.push(operation)
    })
    return this._collection.bulkWrite(operations)
  }

  get (me) {
    return this._collection.findOne({ name: me }, { fields: { friends: 1 } })
      .then(result => result.friends)
  }

  sync (subject, result) {
  }
}
