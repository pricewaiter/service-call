const expect = require('chai').expect;
const serviceCall = require('../src').serviceCall;

const retryOpts = { max: 1 };

describe('dns resolution', () => {
    beforeEach(() => {
        process.env.SERVICE_CALL_CHAOS_PERCENT = '0';
    });

    it('rejects with error when hostname not found', (done) => {
        const example = serviceCall('notfound.nonexistant', retryOpts).get('/');

        example().catch((err) => {
            expect(err.code).to.equal('ENOTFOUND');
            done();
        });
    });

    it('rejects with error when hostname has no SRV', (done) => {
        const example = serviceCall('www.pricewaiter.com', retryOpts).get('/');

        example().catch((err) => {
            expect(err.code).to.equal('ENODATA');
            done();
        });
    });

    it('rejects with error when hostname not supplied', (done) => {
        const example = serviceCall(undefined, retryOpts).get('/');

        example().catch((err) => {
            expect(err.message).to.equal('serviceHostname is required.');
            done();
        });
    });
});
