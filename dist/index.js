const vhx = require('vhx');
const log = require('debug')('vimeo-promise:client');
const util = require('util');

const vhxResourceProxy = resource => new Proxy(
  resource,
  {
    get(target, key) {
      const result = Reflect.get(target, key);

      if (typeof result !== 'function') {
        return result;
      }

      return (...args) => new Promise((resolve, reject) => {
        args.push((err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        });

        log(result);
        return Reflect.apply(result, resource, args);
      });
    },
  }
);

const noProxy = [
  util.inspect.custom,
  'inspect',
  Symbol.toStringTag,
  Symbol.iterator,
];

const doNotProxy = v => noProxy.includes(v);

module.exports = (apiKey = '') => {
  const client = vhx(apiKey);
  return new Proxy(
    client,
    {
      get(target, key) {
        log(`Key: ${key}`);
        if (doNotProxy(key)) {
          return client;
        }

        const result = Reflect.get(target, key);
        if (typeof result === 'function') {
          return result;
        }
        return vhxResourceProxy(result);
      },
    }
  );
}