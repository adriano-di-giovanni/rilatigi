describe('unmutual', () => {
  let resolverA, resolverB, resolverC, resolverD
  let subject
  let objects

  before(() => {
    subject = 'He-Man'
    objects = ['Skeletor']
  })

  beforeEach(() => {
    resolverA = {
      start: sinon.stub(),
      end: sinon.stub(),
      get: sinon.stub().returns(null),
      sync: sinon.stub()
    }
    resolverB = {
      start: sinon.stub(),
      end: sinon.stub(),
      get: sinon.stub().returns(void 0),
      sync: sinon.stub()
    }
    resolverC = {
      start: sinon.stub(),
      end: sinon.stub(),
      get: sinon.stub().returns('Skeletor'),
      sync: sinon.stub()
    }
    resolverD = {
      start: sinon.stub().throws(),
      end: sinon.stub().throws(),
      get: sinon.stub().throws(),
      sync: sinon.stub()
    }
  })

  context('start', () => {
    it('should invoke all resolvers and fulfill', () => {
      return unmutual([resolverA, resolverB])
        .start(subject, objects)
        .then(result => {
          const a = resolverA.start
          const b = resolverB.start

          expect(a.calledWith(subject, objects)).to.be.true
          expect(a.calledOnce).to.be.true
          expect(b.calledWith(subject, objects)).to.be.true
          expect(b.calledOnce).to.be.true
          expect(b.calledBefore(a)).to.be.true
          expect(result).to.be.undefined
        })
    })

    it('should invoke some resolvers and reject', () => {
      return unmutual([resolverA, resolverD, resolverC])
        .start(subject, objects)
        .catch(error => {
          const a = resolverA.start
          const c = resolverC.start
          const d = resolverD.start

          expect(a.called).to.be.false
          expect(c.calledWith(subject, objects)).to.be.true
          expect(c.calledOnce).to.be.true
          expect(c.calledBefore(d)).to.be.true
          expect(d.calledWith(subject, objects)).to.be.true
          expect(d.calledOnce).to.be.true
          expect(d.threw()).to.be.true
          expect(error).to.be.instanceof(Error)
        })
    })
  })

  context('end', () => {
    it('should invoke all resolvers and fulfill', () => {
      return unmutual([resolverA, resolverB])
        .end(subject, objects)
        .then(result => {
          const a = resolverA.end
          const b = resolverB.end

          expect(a.calledWith(subject, objects)).to.be.true
          expect(a.calledOnce).to.be.true
          expect(b.calledWith(subject, objects)).to.be.true
          expect(b.calledOnce).to.be.true
          expect(b.calledBefore(a)).to.be.true
          expect(result).to.be.undefined
        })
    })

    it('should invoke some resolvers and reject', () => {
      return unmutual([resolverA, resolverD, resolverC])
        .end(subject, objects)
        .catch(error => {
          const a = resolverA.end
          const c = resolverC.end
          const d = resolverD.end

          expect(a.called).to.be.false
          expect(c.calledWith(subject, objects)).to.be.true
          expect(c.calledOnce).to.be.true
          expect(c.calledBefore(d)).to.be.true
          expect(d.calledWith(subject, objects)).to.be.true
          expect(d.calledOnce).to.be.true
          expect(d.threw()).to.be.true
          expect(error).to.be.instanceof(Error)
        })
    })
  })

  context('get', () => {
    it('should invoke all resolvers and fulfill', () => {
      return unmutual([resolverA, resolverB, resolverC])
        .get(subject)
        .then(result => {
          const a = resolverA.get
          const b = resolverB.get
          const c = resolverC.get

          expect(a.calledWith(subject)).to.be.true
          expect(a.calledOnce).to.be.true
          expect(a.calledBefore(b)).to.be.true
          expect(b.calledWith(subject)).to.be.true
          expect(b.calledOnce).to.be.true
          expect(b.calledBefore(c)).to.be.true
          expect(c.calledWith(subject)).to.be.true
          expect(c.calledOnce).to.be.true
          expect(result).to.equal('Skeletor')
        })
    })

    it('should invoke some resolvers and fulfill', () => {
      return unmutual([resolverA, resolverC, resolverB])
        .get(subject)
        .then(result => {
          const a = resolverA.get
          const b = resolverB.get
          const c = resolverC.get

          expect(a.calledWith(subject)).to.be.true
          expect(a.calledOnce).to.be.true
          expect(a.calledBefore(c)).to.be.true
          expect(b.called).to.be.false
          expect(c.calledWith(subject)).to.be.true
          expect(c.calledOnce).to.be.true
          expect(result).to.equal('Skeletor')
        })
    })
  })
})
