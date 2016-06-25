# Service Call

ServiceCall is a factory that returns a function that performs DNS service discovery and HTTP requests, returning a Promise.

## Example:

```javascript

const serviceCall = require('service-call');

const fooService = serviceCall(process.env.PRODUCTS_DNS_NAME, retryOptions).post('/v1/products');

fooService(postBody, options)
    .then(({ res, body }) => console.log('Product creation success!', body.id))
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
