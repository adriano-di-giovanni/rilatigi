import Promise from 'bluebird'
import { MongoClient } from 'mongodb'
import MongoFriendshipResolver from '../../src/MongoFriendshipResolver'

describe('MongoFriendshipResolver', () => {
  let db
  let resolver

  beforeEach(() => {
    const options = {
      promiseLibrary: Promise
    }
    return MongoClient.connect('mongodb://localhost/db', options)
      .then(db_ => {
        db = db_
        resolver = new MongoFriendshipResolver(db_)
      })
  })

  afterEach(() => {
    return db.close()
  })

  it('start', () => {
    return resolver.start(['Tom', 'Jerry'])
  })

  it('get', () => {
    return resolver.get('Tom')
  })

  it('end', () => {
    return resolver.end(['Tom', 'Jerry'])
  })
})
