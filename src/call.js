
const retry = require('retry-promise').default;
const request = require('request');
const ServiceDiscovery = require('./service_discovery');

/**
 * ServiceCall is a factory that returns a function that performs DNS service discovery
 * and HTTP requests, returning a Promise.
 *
 * Example:
 *
 * const fooService = new ServiceCall(process.env.FOO_DNS_NAME, retryOptions).post('/v1/foos');
 *
 * fooService(postBody, options)
 *     .then(({ res, body }) => console.log('Foo creation success!', body.id))
 *     .catch(err => console.log('Service call failed!', err.message));
 */
class ServiceCall {

    constructor(hostname, retryOptions) {
        this.hostname = hostname;
        this.options = {
            query: {},
            method: 'GET',
            json: true,
        };
        this.retryOptions = Object.assign({}, {
            max: 5,
            backoff: 500,
        }, retryOptions);

        return this;
    }

    get(path) {
        return this.closure('GET', path);
    }
    post(path) {
        return this.closure('POST', path);
    }
    delete(path) {
        return this.closure('DELETE', path);
    }
    put(path) {
        return this.closure('PUT', path);
    }

    closure(method, path) {
        return (payload, options = {}) => {
            this.options = Object.assign({}, this.options, options, {
                uri: path,
                body: payload,
                qs: options.query,
            });
            return retry(this.retryOptions, this.discover.bind(this));
        };
    }

    discover() {
        return ServiceDiscovery.discover(this.hostname, this.retryOptions).then(serviceUrl => {
            this.options.baseUrl = serviceUrl;
            return this.httpRequest();
        });
    }

    httpRequest() {
        return new Promise((resolve, reject) => {
            request(this.options, (err, res) => {
                if (err) return reject(err);

                if (res.body.errors && res.body.errors.length) {
                    return reject(new Error(res.body.errors[0].message));
                }

                return resolve({ res, body: res.body });
            });
        });
    }
}

module.exports = ServiceCall;
