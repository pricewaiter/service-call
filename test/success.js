const expect = require('chai').expect;
const serviceCall = require('../src').serviceCall;
const processHttpResponsePromiseFactory = require('../src/call')
    .processHttpResponsePromiseFactory;

describe('successful calls', () => {
    beforeEach(() => {
        process.env.SERVICE_CALL_CHAOS_PERCENT = '0';
    });

    it('can process GET request', (done) => {
        const example = serviceCall(
            'service-call-example1.pricewaiter.com'
        ).get('/posts/1');

        example().then((result) => {
            expect(result.res.statusCode).to.equal(200);
            expect(result.body.id).to.equal(1);
            done();
        });
    });

    it('can process GET request with query strings', (done) => {
        const example = serviceCall(
            'service-call-example1.pricewaiter.com'
        ).get('/posts');

        example(null, {
            query: {
                userId: 9,
            },
        }).then((result) => {
            expect(result.res.statusCode).to.equal(200);
            expect(result.body[0].userId).to.equal(9);
            done();
        });
    });

    it('can process POST request', (done) => {
        const example = serviceCall(
            'service-call-example1.pricewaiter.com'
        ).post('/posts');

        example({ name: 'Posty McPostFace' }).then((result) => {
            expect(result.res.statusCode).to.equal(201);
            expect(result.body.id).to.equal(101);
            expect(result.body.name).to.equal('Posty McPostFace');
            done();
        });
    });

    it('can process PUT request', (done) => {
        const example = serviceCall(
            'service-call-example1.pricewaiter.com'
        ).put('/posts/1');

        example({ name: 'Putty McPutFace' }).then((result) => {
            expect(result.res.statusCode).to.equal(200);
            expect(result.body.id).to.equal(1);
            expect(result.body.name).to.equal('Putty McPutFace');
            done();
        });
    });

    it('can process DELETE request', (done) => {
        const example = serviceCall(
            'service-call-example1.pricewaiter.com'
        ).delete('/posts/1');

        example().then((result) => {
            expect(result.res.statusCode).to.equal(200);
            expect(result.body).to.deep.equal({});
            done();
        });
    });

    it('handles empty 200 response', (done) => {
        const resolve = (resp) => {
            expect(resp.res.statusCode).to.equal(200);
            expect(resp.res.body).to.not.exist;
            done();
        };
        const reject = () => {};
        const handler = processHttpResponsePromiseFactory(resolve, reject);
        handler(undefined, {
            statusCode: 200,
        });
    });
});
