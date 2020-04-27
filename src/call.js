const retry = require('retry-promise').default;
const axios = require('axios');
const log = require('debug')('service-call:verbose');
const ServiceDiscovery = require('./service_discovery');

function processHttpResponse(axiosResult) {
    return axiosResult
        .catch((err) => {
            log('HTTP error:', err.message);
            const error = new Error(err.message);
            if (err.response) {
                error.statusCode = err.response.status;
            }

            return Promise.reject(error);
        })
        .then((result) => {
            log('HTTP response statusCode', result.status);

            if (
                result.data &&
                result.data.errors &&
                result.data.errors.length
            ) {
                const error = new Error(result.data.errors[0].message);
                error.statusCode = 400;
                return Promise.reject(error);
            }

            return Promise.resolve({
                res: { statusCode: result.status, ...result },
                body: result.data,
            });
        });
}

function httpRequest(options) {
    log('service resolved to host:', options.baseURL);
    return processHttpResponse(axios(options));
}

function discover(hostname, requestOptions) {
    return ServiceDiscovery.discover(hostname).then((serviceUrl) =>
        httpRequest(
            Object.assign({}, requestOptions, {
                baseURL: serviceUrl,
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
                url: path,
                params: options.query,
            }
        );

        // avoid a content-length from setting emptyish body
        if (payload) {
            requestOptions.data = payload;
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
    processHttpResponse,
    serviceCall,
};
