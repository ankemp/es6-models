export const EXCLUDED_PROPERTIES_KEY = 'serde:excluded_properties';

/* tslint:disable:variable-name only-arrow-functions */
/**
 * Adding this decorator prevents the property from being included in the object built by Serde.serialize()
 */
export function Exclude(): PropertyDecorator {
    return function (target: Object, propertyKey: PropertyKey): void {
      Reflect.defineMetadata(
        EXCLUDED_PROPERTIES_KEY,
        [
          ...Reflect.getMetadata(EXCLUDED_PROPERTIES_KEY, target) || [],
          propertyKey
        ],
        target
      );
    };
  }