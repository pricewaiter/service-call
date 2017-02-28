# Service Call

Perform service lookups via DNS queries and make HTTP requests to those services. Designed for [consul]() and similar service registries.

For example you make have a service registered with consul named `stats` and available with the DNS name `service-stats.service.consul`.  Your consul DNS service should return the host and point of one or more services available in response to a `SRV` request.

## GET Example:

```javascript

const { serviceCall } = require('service-call');

const listProducts = serviceCall(process.env.PRODUCTS_DNS_NAME).get('/v1/products');

// store_id will be used as a query string in the GET request
const options = {
    query: {
        store_id: 42,
    },
};

listProducts({}, options)
    .then(({ res, body }) => console.log('Products for store 42:', body.items))
    .catch(err => console.log('Service call failed!', err.message));
```

## CHAOS!

In development, you can introduce a controlled amount of failures & retries.
Set the env `process.env.SERVICE_CALL_CHAOS_PERCENT` to a value between 0 and 1. Ex: `0.30` means 30% failure rate.

## Retry options

Using the [retry-promise](https://github.com/olalonde/retry-promise) package, any DNS or HTTP failures will be retried.  The following retry options are available:

```
{
    max: 10,
    backoff: 1000,
}
```

## POST example with more retrying

```javascript

const { serviceCal }l = require('service-call');

const retryOptions = { max: 6, backoff: 500 };
const createProduct = serviceCall(process.env.PRODUCTS_DNS_NAME, retryOptions).post('/v1/products');

const payload = {
    name: 'Example Name',
    brand: 'Example Brand',
};

createProduct(payload)
    .then(({ res, body }) => console.log('Product created!', body.id))
    .catch(err => console.log('Service call failed!', err.message));
```
