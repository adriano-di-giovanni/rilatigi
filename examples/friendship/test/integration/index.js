import Promise from 'bluebird'
import Redis from 'ioredis'
import RedisFriendshipResolver from '../../src/RedisFriendshipResolver'
import MongoFriendshipResolver from '../../src/MongoFriendshipResolver'
import fixtures, { connect } from '../fixtures'

describe.only('integration', () => {
  let client
  let db
  let rfr, mfr
  let friendship
  let resetSpies

  before(() => {
    return fixtures()
      .then(() => {
        return connect()
          .then(db_ => {
            db = db_
            client = new Redis()

            rfr = new RedisFriendshipResolver(client)
            mfr = new MongoFriendshipResolver(db)

            const methodNames = ['start', 'end', 'get', 'sync']

            methodNames.forEach(methodName => {
              sinon.spy(rfr, methodName)
              sinon.spy(mfr, methodName)
            })

            resetSpies = () => {
              methodNames.forEach(methodName => {
                rfr[methodName].reset()
                mfr[methodName].reset()
              })
            }

            friendship = mutual([rfr, mfr])
          })
      })
  })

  after(() => {
    return Promise.all([
      db.close(),
      client.disconnect()
    ])
  })

  it('should work', () => {
    const friends = ['Tom', 'Jerry']
    return friendship.start(friends)
      .then(() => {
        expect(rfr.start.calledOnce).to.be.true
        expect(rfr.start.calledWith(friends)).to.be.true
        expect(mfr.start.calledOnce).to.be.true
        expect(mfr.start.calledWith(friends)).to.be.true
        expect(mfr.start.calledBefore(rfr.start)).to.be.true
        resetSpies()
      })
      .then(() => {
        const me = 'Tom'
        return friendship.get(me)
          .then(result => {
            expect(rfr.get.calledOnce).to.be.true
            expect(rfr.get.calledWith(me)).to.be.true
            expect(mfr.get.called).to.be.false
            expect(rfr.get.calledBefore(mfr.get)).to.be.true
            expect(result).to.deep.equal(['Jerry'])
            resetSpies()
          })
      })
      .then(() => {
        const me = 'Jerry'
        return friendship.get(me)
          .then(result => {
            expect(rfr.get.calledOnce).to.be.true
            expect(rfr.get.calledWith(me)).to.be.true
            expect(mfr.get.called).to.be.false
            expect(rfr.get.calledBefore(mfr.get)).to.be.true
            expect(result).to.deep.equal(['Tom'])
            resetSpies()
          })
      })
      .then(() => {
        return client.flushall()
      })
      .then(() => {
        const me = 'Tom'
        return friendship.get(me)
          .then(result => {
            expect(rfr.get.calledOnce).to.be.true
            expect(rfr.get.calledWith(me)).to.be.true
            expect(rfr.sync.calledOnce).to.be.true
            expect(rfr.sync.calledWith(me, result)).to.be.true
            expect(mfr.get.calledOnce).to.be.true
            expect(mfr.get.calledWith(me)).to.be.true
            expect(rfr.get.calledBefore(mfr.get)).to.be.true
            expect(rfr.sync.calledAfter(mfr.get)).to.be.true
            expect(result).to.deep.equal(['Jerry'])
            resetSpies()
          })
      })
      .then(() => {
        const me = 'Tom'
        return friendship.get(me)
          .then(result => {
            expect(rfr.get.calledOnce).to.be.true
            expect(rfr.get.calledWith(me)).to.be.true
            expect(mfr.get.called).to.be.false
            expect(rfr.get.calledBefore(mfr.get)).to.be.true
            expect(result).to.deep.equal(['Jerry'])
            resetSpies()
          })
      })
      .then(() => {
        const friends = ['Tom', 'Jerry']
        return friendship.end(friends)
          .then(result => {
            expect(rfr.end.calledOnce).to.be.true
            expect(rfr.end.calledWith(friends)).to.be.true
            expect(mfr.end.calledOnce).to.be.true
            expect(mfr.end.calledWith(friends)).to.be.true
            expect(mfr.end.calledBefore(rfr.end)).to.be.true
            resetSpies()
          })
      })
  })
})
