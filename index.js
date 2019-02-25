const vhx = require('vhx');
const log = require('debug')('vimeo-promise:client');


const vimeoResourceProxy = resource => new Proxy(
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

class VhxProxy {
  constructor(apiKey) {
    this.client = new vhx(apiKey);
  }

  get() {
    return new Proxy(
      this.client,
      {
        get(target, key) {
          const result = Reflect.get(target, key);
          if (typeof result === 'function') {
            return result;
          }
          return vimeoResourceProxy(result);
        },
      }
    );
  }
};

module.exports = VhxProxy;