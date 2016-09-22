import Redis from 'ioredis'
import RedisFriendshipResolver from '../../src/RedisFriendshipResolver'

describe('RedisFriendshipResolver', () => {
  let client
  let resolver

  beforeEach(() => {
    client = new Redis()
    resolver = new RedisFriendshipResolver(client)
  })

  afterEach(() => {
    client.disconnect()
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
