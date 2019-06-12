const express = require('express');
const expect = require('chai').expect;
const serviceCall = require('../src').serviceCall;

const app = express();

app.get('/bad', (req, res) => {
    res.status(401).json({ errors: ['bad user'] });
});

const retryOpts = { max: 2 };
const PORT = 6789;

describe('error codes', () => {
    before(() => {
        process.env.SERVICE_CALL_CHAOS_PERCENT = '0';
        app.listen(PORT);
    });

    it('passes the http status code on', (done) => {
        const example = serviceCall(
            'service-call-localhost.pricewaiter.com',
            retryOpts
        ).get('/bad');

        example({}).catch((err) => {
            expect(err.statusCode).to.equal(401);
            done();
        });
    });
});
