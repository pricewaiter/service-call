# Service Call

ServiceCall is a factory that returns a function that performs DNS service discovery and HTTP requests, returning a Promise.

## Example:

```javascript

const ServiceCall = require('service-call');

const fooService = ServiceCall(process.env.PRODUCTS_DNS_NAME, retryOptions).post('/v1/products');

fooService(postBody, options)
    .then(({ res, body }) => console.log('Product creation success!', body.id))
    .catch(err => console.log('Service call failed!', err.message));
```
