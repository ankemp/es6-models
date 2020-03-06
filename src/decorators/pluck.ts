export const PLUCK_PROPERTIES_KEY = 'serde:pluck_properties';

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