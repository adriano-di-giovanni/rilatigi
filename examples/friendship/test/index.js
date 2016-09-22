import Promise from 'bluebird'
import chai from 'chai'
import sinon from 'sinon'
import rilatigi, { mutual, unmutual } from 'rilatigi'

global.expect = chai.expect
global.sinon = sinon
global.mutual = mutual
global.unmutual = unmutual

rilatigi.Promise = Promise
