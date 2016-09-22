# Rilatigi

[![NPM Version](https://img.shields.io/npm/v/rilatigi.svg?style=flat)](https://www.npmjs.com/package/rilatigi)
[![David](https://img.shields.io/david/adriano-di-giovanni/rilatigi.svg?maxAge=2592000)]()
[![David](https://img.shields.io/david/dev/adriano-di-giovanni/rilatigi.svg?maxAge=2592000)]()
[![Build Status](https://travis-ci.org/adriano-di-giovanni/rilatigi.svg?branch=master)](https://travis-ci.org/adriano-di-giovanni/rilatigi)
[![codecov](https://codecov.io/gh/adriano-di-giovanni/rilatigi/branch/master/graph/badge.svg)](https://codecov.io/gh/adriano-di-giovanni/rilatigi)
[![Twitter Follow](https://img.shields.io/twitter/follow/codecreativity.svg?style=social&label=Follow&maxAge=2592000)]()

Rilatigi means _to relate_ in esperanto.

Rilatigi is a promise-based relationship CRUD library for Node.js. It aims to streamline relationship CRUD operations when you have to keep multiple data sources synced (i.e. caching layer and persistence layer).

Rilatigi is data source agnostic and delegates resolution of CRUD operations to resolvers.

CRUD operations are `start`, `end`, `get` and `sync`. Those operations can be performed on `mutual` and `unmutual` relationships.

## Installation

```bash
npm install rilatigi --save
```

## Usage

### Plug in your favourite promise library

Set `rilatigi.Promise` to your favourite ES6-style promise constructor and rilatigi will use it.

```bash
npm install bluebird --save
```

```javascript
import Promise from 'bluebird'
import rilatigi from 'rilatigi'

rilatigi.Promise = Promise
```

### Define resolvers

Rilatigi doesn't make any assumption about your resolvers but having `start`, `end`, `get` and `sync` methods.

Signatures for these methods differ depending on the type of relationship (`mutual`, `unmutual`) a resolver manages.

#### Mutual resolvers

```javascript
class MutualResolver {
  start (subjects) {

  }
  end (subjects) {

  }
  get (subject) {

  }
  sync (subject, result) {

  }
}
```

#### Unmutual resolvers

```javascript
class UnmutualResolver {
  start (subject, objects) {

  }
  end (subject, objects) {

  }
  get (subject) {

  }
  sync (subject, result) {

  }
}
```

### Define and use relationships

You can define `mutual` and `unmutual` relationships.

The Following examples show you both `mutual` and `unmutual` relationship definition and usage in the context of multiple data sources (Redis and Mongo).

Definition of resolvers is omitted but you can take a look at the [examples](https://github.com/adriano-di-giovanni/rilatigi/examples)

#### Mutual relationships

```javascript
import { mutual } from 'rilatigi'
import { redisFriendshipResolver, mongoFriendshipResolver } from './resolvers'

const friendship = mutual([redisFriendshipResolver, mongoFriendshipResolver])

friendship
  .start(['Tom', 'Jerry'])
  .then(() => friendship.get('Tom'))
  .then(result => console.log(result)) // ['Jerry']
```

#### Unmutual relationships

```javascript
import { unmutual } from 'rilatigi'
import { redisSpeakToResolver, mongoSpeakToResolver} from './resolvers'

const speakTo = unmutual([redisSpeakToResolver, mongoSpeakToResolver])

speakTo
  .start('teacher', ['a student', 'another student'])
  .then(() => speakTo.get('teacher'))
  .then(result => console.log(result)) // ['a student', 'another student']
```

## Operations lifecycle

### start

When you invoke `start` on a relationship, rilatigi will sequentially invoke `start` on its resolvers, starting from the last resolver.

### end

When you invoke `end` on a relationship, rilatigi will sequentially invoke `end` on its resolvers, starting from the last resolver.

### get

When you invoke `get` on a relationship, rilatigi will sequentially invoke `get` on its resolvers, starting from the first resolver, until a valid result is returned or all resolvers' `get` got invoked. Non-valid results are `null`, `undefined`, empty strings, empty arrays.

Rilatigi will also invoke `sync` on all resolvers that returned a non-valid value in order to keep data sources synced.

### sync

You shouldn't invoke `sync` on a relationship. It's for internal use.

## License

The project is licensed under the MIT license.
