var fixture = require('./e2e.fixture');
var expect = require('chai').expect;

describe('This file is a e2e test in itself as it', function () {
    it('asserts the obvious', function () {
        expect(fixture).to.eql('FIXTURE');
    });
});