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

        log(result);
        return Reflect.apply(result, resource, args);
      });
    },
  }
);

class VhxProxy {
  constructor (apiKey, options = {}) {
    this.client = vhx(key, options);
  }
  get () {
    new Proxy(
      this.client,
      {
        get(target, key) {
          const result = Reflect.get(target, key);
          if (typeof result === 'function') {
            return result;
          }
          log(result);
          return vhxResourceProxy(result);
        },
      }
    )
  }
}
module.exports = VhxProxy;
// module.exports = apiKey => new Proxy(
//   vhx(apiKey),
//   {
//     get(target, key) {
//       const result = Reflect.get(target, key);
//       if (typeof result === 'function') {
//         return result;
//       }
//       log(result);
//       return vhxResourceProxy(result);
//     },
//   }
// );