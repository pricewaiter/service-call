
const { expect } = require('chai');
const { serviceCall } = require('../src');

const retryOpts = { max: 1 };

describe('dns resolution', () => {
    it('resolves with error when hostname not found', (done) => {
        const example = serviceCall('notfound.nonexistant', retryOpts).get('/');

        example()
        .catch(err => {
            expect(err.code).to.equal('ENOTFOUND');
            done();
        });
    });
});
