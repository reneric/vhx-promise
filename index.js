const vhx = require('vhx');
const log = require('debug')('vimeo-promise:client');


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

        return Reflect.apply(result, resource, args);
      });
    },
  }
);

module.exports = apiKey => new Proxy(
  vhx(apiKey),
  {
    get(target, key) {
      const result = Reflect.get(target, key);
      if (typeof result === 'function') {
        return result;
      }
      return vhxResourceProxy(result);
    },
  }
);;