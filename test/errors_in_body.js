
const expect = require('chai').expect;
const serviceCall = require('../src').serviceCall;

const retryOpts = { max: 1 };
const goodUrl = 'service-call-example1.pricewaiter.com';

describe('error handling', () => {
    beforeEach(() => {
        process.env.SERVICE_CALL_CHAOS_PERCENT = '0';
    });

    it('looks for errors array in body', (done) => {
        const example = serviceCall(goodUrl, retryOpts).put('/posts/1');

        example({
            errors: [
                {
                    message: 'Could not update at this time.',
                },
            ],
        })
        .catch(err => {
            expect(err.message).to.equal('Could not update at this time.');
            done();
        });
    });
});
