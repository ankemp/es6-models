import "reflect-metadata";


/* tslint:disable:comment-type */
export const PLUCK_PROPERTIES_KEY = 'serde:pluck_properties';
export const EXCLUDED_PROPERTIES_KEY = 'serde:excluded_properties';

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

/* tslint:disable:variable-name only-arrow-functions */
/**
 * Adding this decorator prevents the property from being included in the object built by Serde.serialize()
 */
export function Exclude(): Function {
  return function (target: any, key: string): void {
    Reflect.defineMetadata(
      EXCLUDED_PROPERTIES_KEY,
      [
        ...Reflect.getMetadata(EXCLUDED_PROPERTIES_KEY, target) || [],
        key
      ],
      target
    );
  };
}

/**
 * Adding this decorator allows for plucking out an T[] or {T: v}[]
 *
 * @param field  - use 'fieldName' when creating string|number[],
 * use ['fieldName'] when creating {[fieldName]: value}[]
 */
export function Pluck(field: string | string[]): Function {
  return function (target: any, key: string): void {
    Reflect.defineMetadata(PLUCK_PROPERTIES_KEY, {
      ...Reflect.getMetadata(PLUCK_PROPERTIES_KEY, target) || {},
      ...{ [key]: field }
    }, target);
  };
}

/* tslint:enable:variable-name */