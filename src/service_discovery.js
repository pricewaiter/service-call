
const dns = require('dns');
const log = require('debug')('service-call:dns');
const verboseLog = require('debug')('service-call:verbose');

function chaosMonkeyIsMad() {
    return process.env.SERVICE_CALL_CHAOS_PERCENT
        && Math.random() < process.env.SERVICE_CALL_CHAOS_PERCENT;
}

const Services = {

    discover(serviceHostname) {
        if (!serviceHostname) {
            return Promise.reject(new Error('serviceHostname is required.'));
        }

        return this.lookup(serviceHostname);
    },

    lookup(hostname) {
        const name = this.alterServiceName(hostname);
        verboseLog('Looking up DNS:', name);
        return new Promise((resolve, reject) => {
            dns.resolve(name, 'SRV', (err, res) => {
                if (err) {
                    log('DNS error:', err.message);
                    return reject(err);
                }

                if (res.length > 0) {
                    return resolve(this.formatHostResult(res));
                }

                log('service-call fail %s DNS.', name, res);
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
            return `${serviceHostname}.super.fake`;
        }

        return serviceHostname;
    },
};

module.exports = Services;
