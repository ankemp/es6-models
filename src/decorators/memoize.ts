export function Memoize(propsToWatch?: string[]): MethodDecorator {
    const hasPropsToWatch = typeof propsToWatch !== 'undefined' && Array.isArray(propsToWatch);
    if (typeof propsToWatch !== 'undefined' && !hasPropsToWatch) {
        throw new Error('Somethings wrong with the propsToWatch Array');
    }
    return function(target: Object, propertyKey: PropertyKey, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(this: any, ...args: any[]) {
            let modelKeyPart = this;
            if (hasPropsToWatch) {
                const filteredEntries  = Object.entries(this).filter(([k,v]) => propsToWatch.includes(k))
                modelKeyPart = Object.fromEntries(filteredEntries);
            }
            const reflectKey = `${JSON.stringify(modelKeyPart)}_${JSON.stringify(args)}_${String(propertyKey)}`;
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