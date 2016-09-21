import chai from 'chai'
import sinon from 'sinon'
import Promise from 'bluebird'
import rilatigi, { mutual, unmutual } from '../src'

global.expect = chai.expect
global.sinon = sinon
global.mutual = mutual
global.unmutual = unmutual

rilatigi.Promise = Promise
