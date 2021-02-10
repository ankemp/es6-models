import { EXCLUDED_PROPERTIES_KEY, PLUCK_PROPERTIES_KEY, STRONG_CLASS_KEY, STRONG_ERROR_MESSAGE } from './decorators';

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

  private checkStrongTypes(input: Partial<S>): boolean {
    const strongTyped = Reflect.getMetadata(STRONG_CLASS_KEY, this);
    if (!strongTyped) {
      return true;
    }
    return Object.entries(strongTyped).every(([key, type]) => {
      if (typeof type === 'string') {
        return typeof input[key] === type;
      }
      if (typeof type === 'object') {
        const clazz = type as any;
        return input[key] instanceof clazz; 
      }
      return false;
    });
  }

  copyWith<C extends S>(input: { [P in keyof Partial<C>]: any }): this {
    if (!this.checkStrongTypes(input)) {
      throw Error(STRONG_ERROR_MESSAGE);
    }
    return Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
      input
    );
  }

  populate?(params: any): this;

  customSerialize?<C extends S>(input: { [P in keyof Partial<C>]: any }): any;

  deserialize(input: Partial<S>): this {
    if (this.checkStrongTypes(input)) {
      Object.assign(this, input);
      return this;
    }
    throw Error(STRONG_ERROR_MESSAGE);
  }

  serialize() {
    const pluckProperties = Reflect.getMetadata(PLUCK_PROPERTIES_KEY, this) as {[key: string]: any};
    let serializedObj = Object.entries(this)
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
        return obj;
      }, {} as Partial<S>);
      if (typeof this.customSerialize === 'function') {
        serializedObj = this.customSerialize(serializedObj);
      }
      return serializedObj;
  }

}