
const expect = require('chai').expect;
const serviceCall = require('../src').serviceCall;

describe('successful calls', () => {
    beforeEach(() => {
        process.env.SERVICE_CALL_CHAOS_PERCENT = '0';
    });

    it('can process GET request', (done) => {
        const example = serviceCall('service-call-example1.pricewaiter.com').get('/posts/1');

        example()
        .then(result => {
            expect(result.body.id).to.equal(1);
            done();
        });
    });
});
