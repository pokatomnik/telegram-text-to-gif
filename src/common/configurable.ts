export class Configurable<T extends {} = {}> {
    private readonly config: T;

    constructor(initial: T) {
        this.config = initial;
    }

    public update<K extends keyof T>(key: K, newValue: T[K]) {
        this.config[key] = newValue;
    }

    public merge(newConfig: T) {
        Object.assign(this.config, newConfig);
    }

    public getConfig() {
        return this.config;
    }
}
