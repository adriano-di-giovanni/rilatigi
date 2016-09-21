const rilatigi = {}

const createSync = resolvers => (subject, result) => {
  return resolvers
    .reduceRight(
      (promise, resolver) => promise.then(() => resolver.sync(subject, result)),
      rilatigi.Promise.resolve()
    )
    .then(() => result)
}

const createGet = resolvers => subject => {
  const unresolvers = []
  return resolvers
    .reduce(
      (promise, resolver, index, resolvers) => {
        return promise.then(result => {
          if (result == null) {
            if (index > 0) {
              unresolvers.push(resolvers[index - 1])
            }
            return resolver.get(subject)
          }
          return result
        })
      },
      rilatigi.Promise.resolve()
    )
    .then(result => createSync(unresolvers)(subject, result))
}

const mutual = resolvers => {
  return {
    start (subjects) {
      return resolvers
        .reduceRight(
          (promise, resolver) => promise.then(() => resolver.start(subjects)),
          rilatigi.Promise.resolve()
        )
    },
    end (subjects) {
      return resolvers
        .reduceRight(
          (promise, resolver) => promise.then(() => resolver.end(subjects)),
          rilatigi.Promise.resolve()
        )
    },
    get: createGet(resolvers),
    sync: createSync(resolvers)
  }
}

const unmutual = resolvers => {
  return {
    start (subject, objects) {
      return resolvers
        .reduceRight(
          (promise, resolver) => promise.then(() => resolver
            .start(subject, objects)),
          rilatigi.Promise.resolve()
        )
    },
    end (subject, objects) {
      return resolvers
        .reduceRight(
          (promise, resolver) => promise.then(() => resolver
            .end(subject, objects)),
          rilatigi.Promise.resolve()
        )
    },
    get: createGet(resolvers),
    sync: createSync(resolvers)
  }
}

export default rilatigi
export { mutual, unmutual }
