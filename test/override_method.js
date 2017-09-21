
const expect = require('chai').expect;
const serviceCall = require('../src').serviceCall;

describe('options can override method', () => {
    beforeEach(() => {
        process.env.SERVICE_CALL_CHAOS_PERCENT = '0';
    });

    it('can process POST request', (done) => {
        const example = serviceCall('service-call-example1.pricewaiter.com').get('/posts');

        example({ name: 'Posty McPostFace' }, { method: 'post' })
            .then((result) => {
                expect(result.res.statusCode).to.equal(201);
                expect(result.body.id).to.equal(101);
                expect(result.body.name).to.equal('Posty McPostFace');
                done();
            });
    });

    it('can process PUT request', (done) => {
        const example = serviceCall('service-call-example1.pricewaiter.com').get('/posts/1');

        example({ name: 'Putty McPutFace' }, { method: 'put' })
            .then((result) => {
                expect(result.res.statusCode).to.equal(200);
                expect(result.body.id).to.equal(1);
                expect(result.body.name).to.equal('Putty McPutFace');
                done();
            });
    });

    it('can process DELETE request', (done) => {
        const example = serviceCall('service-call-example1.pricewaiter.com').get('/posts/1');

        example({}, { method: 'delete' })
            .then((result) => {
                expect(result.res.statusCode).to.equal(200);
                expect(result.body).to.deep.equal({});
                done();
            });
    });
});
