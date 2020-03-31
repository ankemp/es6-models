export const STRONG_CLASS_KEY = 'serde:strong_class';

export function Strong(): Function {
    return function(target: any) {
        if (!Reflect.hasMetadata(STRONG_CLASS_KEY, target)) {
            Reflect.defineMetadata(STRONG_CLASS_KEY, 'is_strong_typed', target);
        }
    }
}