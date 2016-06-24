
const dns = require('dns');
const retry = require('retry-promise').default;
const log = require('debug')('pw:service_discovery');

function chaosMonkeyIsMad() {
    return process.env.NODE_ENV === 'dev' && Math.random() <= 0.25;
}

const Services = {

    discoverFromEnv(hostnameEnvVar) {
        const hostname = process.env[hostnameEnvVar];
        if (!hostname) {
            return Promise.reject(new Error(`Env var ${hostnameEnvVar} is not set.`));
        }
        return Services.discover(hostname);
    },

    discover(serviceHostname, retryOptions) {
        if (!serviceHostname) {
            return Promise.reject(new Error('serviceHostname is required.'));
        }

        const doLookup = () => this.lookup(serviceHostname);
        return retry(retryOptions, doLookup);
    },

    lookup(hostname) {
        const name = this.alterServiceName(hostname);
        return new Promise((resolve, reject) => {
            dns.resolve(name, 'SRV', (err, res) => {
                if (err) return reject(err);

                if (res.length > 0) {
                    return resolve(this.formatHostResult(res));
                }

                log('service-discovery fail %s worker DNS.', name);
                return reject(new Error(`service discovery fail; ${name}`));
            });
        });
    },

    formatHostResult(results) {
        const host = results[0];
        if (chaosMonkeyIsMad()) {
            return `http://${host.name}.notexist:${host.port}`;
        }
        return `http://${host.name}:${host.port}`;
    },

    alterServiceName(serviceHostname) {
        if (chaosMonkeyIsMad()) {
            const url = `${serviceHostname}.super.fake`;
            log('CHAOS! Resolved %s to %s', serviceHostname, url);
            return url;
        }

        return serviceHostname;
    },
};

module.exports = Services;
