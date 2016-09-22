import Promise from 'bluebird'
import { MongoClient } from 'mongodb'
import Redis from 'ioredis'

const uri = 'mongodb://localhost/db'
export const connect = () => MongoClient.connect(uri, { promiseLibrary: Promise })

const flushMongo = () => {
  let db
  return connect()
    .then(db_ => {
      db = db_
      return db.listCollections().toArray()
    })
    .then(collections => Promise.all(
      collections
        .filter(collection => !/^system\./.test(collection.name))
        .map(collection => db.dropCollection(collection.name))
    ))
    .then(() => db.close())
}

const flushRedis = () => {
  const client = new Redis()
  return client.flushall()
}

export default () => Promise.all([flushMongo, flushRedis])
  .then(() => void 0)
