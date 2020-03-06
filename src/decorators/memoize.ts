export function Memoize(): Function {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(this: any, ...args: any[]) {
            const reflectKey = `${JSON.stringify(this)}_${JSON.stringify(args)}_${propertyKey}`;
            const hasReflectData = Reflect.hasMetadata(reflectKey, target);

            if (hasReflectData) {
                return Reflect.getMetadata(reflectKey, target)
            } else {
                const result = originalMethod.apply(this, args);
                Reflect.defineMetadata(reflectKey, result, target);
                return result;
            }
        }

        return descriptor;
    }
}