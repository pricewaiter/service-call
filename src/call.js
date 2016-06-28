
const retry = require('retry-promise').default;
const request = require('request');
const ServiceDiscovery = require('./service_discovery');

function processHttpResponsePromiseFactory(resolve, reject) {
    return (err, res) => {
        if (err) return reject(err);

        if (res.body && res.body.errors && res.body.errors.length) {
            return reject(new Error(res.body.errors[0].message));
        }

        return resolve({ res, body: res.body });
    };
}

function httpRequest(options) {
    return new Promise((resolve, reject) => {
        request(options, processHttpResponsePromiseFactory(resolve, reject));
    });
}

function discover(hostname, requestOptions, retryOptions) {
    return ServiceDiscovery.discover(hostname, retryOptions)
    .then(serviceUrl =>
        httpRequest(Object.assign({}, requestOptions, {
            baseUrl: serviceUrl,
        }))
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
            {
                uri: path,
                body: payload,
                qs: options.query,
            }
        );
        return retry(retryOptions, () => discover(hostname, requestOptions, retryOptions));
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
