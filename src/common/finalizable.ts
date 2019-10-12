const FINALIZED_FLAG = '__FINALIZED';

export class Finalizable {
    private [FINALIZED_FLAG] = false;

    protected finalize() {
        this[FINALIZED_FLAG] = true;
    }
}

export function NotFinalized(
    target: unknown,
    propertyKey: unknown,
    propertyDescriptor: PropertyDescriptor
) {
    const method = propertyDescriptor.value;

    if (typeof propertyDescriptor.value !== 'function') {
        return;
    }

    propertyDescriptor.value = function(this: any, ...args: unknown[]) {
        if (this[FINALIZED_FLAG]) {
            throw new Error('Instance is finalized');
        }
        return method.apply(this, args);
    };
}
