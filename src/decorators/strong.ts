export const STRONG_CLASS_KEY = 'serde:strong_class';
export const STRONG_ERROR_MESSAGE = 'Strong Type mismatch';

export function Strong<T>(type: string | T): PropertyDecorator {
    return function(target: Object, propertyKey: PropertyKey) {
        Reflect.defineMetadata(
            STRONG_CLASS_KEY,
            {
              ...Reflect.getMetadata(STRONG_CLASS_KEY, target) || {},
              [propertyKey]: type
            },
            target
          );
    }
}