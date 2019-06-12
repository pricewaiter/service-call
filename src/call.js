const retry = require('retry-promise').default;
const request = require('request');
const log = require('debug')('service-call:verbose');
const ServiceDiscovery = require('./service_discovery');

function processHttpResponsePromiseFactory(resolve, reject) {
    return (err, res) => {
        if (err) {
            log('HTTP error:', err.message);
            return reject(err);
        }

        log('HTTP response statusCode:', res.statusCode);

        if (res.body && res.body.errors && res.body.errors.length) {
            const error = new Error(res.body.errors[0].message);
            error.statusCode = res.statusCode;
            return reject(error);
        }

        return resolve({ res, body: res.body });
    };
}

function httpRequest(options) {
    log('service resolved to host:', options.baseUrl);
    return new Promise((resolve, reject) => {
        request(options, processHttpResponsePromiseFactory(resolve, reject));
    });
}

function discover(hostname, requestOptions) {
    return ServiceDiscovery.discover(hostname).then((serviceUrl) =>
        httpRequest(
            Object.assign({}, requestOptions, {
                baseUrl: serviceUrl,
            })
        )
    );
}

function closure(method, hostname, path, retryOptions) {
    return (payload, opts) => {
        const options = opts ? opts : {}; // eslint-disable-line no-unneeded-ternary
        const requestOptions = Object.assign(
            {
                query: {},
                method: 'GET',
                json: true,
            },
            { method },
            opts,
            {
                uri: path,
                qs: options.query,
            }
        );

        // avoid a content-length from setting emptyish body
        if (payload) {
            requestOptions.body = payload;
        }

        requestOptions.method = requestOptions.method.toUpperCase();
        return retry(retryOptions, () => discover(hostname, requestOptions));
    };
}

function serviceCall(hostname, retryOptions) {
    return {
        get(path) {
            return closure('GET', hostname, path, retryOptions);
        },
        post(path) {
            return closure('POST', hostname, path, retryOptions);
        },
        put(path) {
            return closure('PUT', hostname, path, retryOptions);
        },
        delete(path) {
            return closure('DELETE', hostname, path, retryOptions);
        },
    };
}

module.exports = {
    processHttpResponsePromiseFactory,
    serviceCall,
};
