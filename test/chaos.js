const expect = require('chai').expect;
const serviceCall = require('../src').serviceCall;

const goodUrl = 'service-call-example1.pricewaiter.com';

describe('controlling chaos', () => {
    it('succeeds with minor chaos', (done) => {
        process.env.SERVICE_CALL_CHAOS_PERCENT = 0.3;
        const retry = { max: 10, backoff: 5 };

        const example = serviceCall(goodUrl, retry).get('/posts/1');

        example().then((result) => {
            expect(result.body.id).to.equal(1);
            done();
        });
    });

    it('fails with 100% chaos', (done) => {
        process.env.SERVICE_CALL_CHAOS_PERCENT = 1.0;
        const retry = { max: 3, backoff: 5 };

        const example = serviceCall(goodUrl, retry).get('/posts/1');

        example().catch((err) => {
            expect(err).to.exist;
            done();
        });
    });
});
