import { EXCLUDED_PROPERTIES_KEY, PLUCK_PROPERTIES_KEY } from './decorators';

export abstract class Serde<S> extends Object {
  protected removeableProperty(key: string): boolean {
    return this.hasOwnProperty(key) && !(Reflect.getMetadata(EXCLUDED_PROPERTIES_KEY, this) || []).includes(key);
  }

  protected recursiveSerialize(value: any) {
    if (Array.isArray(value)) {
      return value.map(v => v instanceof Serde ? v.serialize() : v);
    }
    return value instanceof Serde ? value.serialize() : value;
  }

  copyWith<C extends S>(input: { [P in keyof Partial<C>]: any }): this {
    return Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
      input
    );
  }

  populate?(params: any): this;

  customSerialize?<C extends S>(input: { [P in keyof Partial<C>]: any }): any;

  deserialize(input: Partial<S>): this {
    Object.assign(this, input);
    return this;
  }

  serialize() {
    const pluckProperties = Reflect.getMetadata(PLUCK_PROPERTIES_KEY, this) as {[key: string]: any};
    return Object.entries(this)
      .filter(([key, _]) => this.removeableProperty(key))
      .reduce((obj, [key, value]) => {
        if (!!pluckProperties) {
          const properties = pluckProperties[key];
          if (typeof properties !== 'undefined') {
            if (Array.isArray(value)) {
              obj[key] = Array.isArray(properties) ?
                value.map(v => properties.reduce((nv, p) => ({ ...nv, [p]: v[p] }), {})) :
                value.map(v => v[properties]);
            } else {
              obj[key] = Array.isArray(properties) ?
                properties.reduce((nv, p) => ({ ...nv, [p]: value[p] }), {}) :
                value[properties];
            }
            return obj;
          }
        }
        obj[key] = this.recursiveSerialize(value);
        if (typeof this.customSerialize === 'function') {
          obj = this.customSerialize(obj);
        }
        return obj;
      }, {} as Partial<S>);
  }

}