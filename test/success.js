
const { expect } = require('chai');
const { serviceCall } = require('../src');

describe('successful calls', () => {
    it('can process GET request', (done) => {
        const example = serviceCall('service-call-example1.pricewaiter.com').get('/posts/1');

        example()
        .then(({ body }) => {
            expect(body.id).to.equal(1);
            done();
        });
    });
});
