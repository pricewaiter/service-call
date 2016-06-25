
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

    it('can process POST request', (done) => {
        const example = serviceCall('service-call-example1.pricewaiter.com').post('/posts');

        example({ name: 'Posty McPostFace' })
        .then(result => {
            expect(result.body.id).to.equal(101);
            expect(result.body.name).to.equal('Posty McPostFace');
            done();
        });
    });

    it('can process PUT request', (done) => {
        const example = serviceCall('service-call-example1.pricewaiter.com').put('/posts/1');

        example({ name: 'Putty McPutFace' })
        .then(result => {
            expect(result.body.id).to.equal(1);
            expect(result.body.name).to.equal('Putty McPutFace');
            done();
        });
    });

    it('can process DELETE request', (done) => {
        const example = serviceCall('service-call-example1.pricewaiter.com').delete('/posts/1');

        example()
        .then(result => {
            expect(result.body).to.deep.equal({});
            done();
        });
    });

});
