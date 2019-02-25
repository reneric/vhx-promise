const vhx = require('vhx');
const log = require('debug')('vimeo-promise:client');

const vimeoClient = vhx(vimeoConfig.api_key);


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

const vimeoProxy = new Proxy(
  vimeoClient,
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

class VhxProxy {
  constructor(apiKey) {
    this.client = new vhx(apiKey);
  }

  get() {
    return new Proxy(
      vimeoClient,
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