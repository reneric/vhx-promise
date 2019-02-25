# Async/promisified Vimeo OTT/VHX Node.js API Client

Use the Vimeo OTT (vhx) API client with async/await or promises.

### Installation

`npm install vhx-promise`

### Getting Started

The first step is setting up your instance of the Client:

```js
const vhxPromise = require('vhx-promise');

const vhx = new vhxPromise('YOUR_API_KEY_HERE');
```


Async/await:
```js
async () => {
    // Customer creation example
    const customer = await vhx.customers.create({
      email: 'customer@email.com',
      name: 'First Last'
    });
    console.log(customer);
    return customer;
};
```

Promises:
```js
() => {
    // Customer creation example
    return vhx.customers.create({
      email: 'customer@email.com',
      name: 'First Last'
    })
      .then((customer) => {
        console.log(customer);
        return customer;
      });
};
```