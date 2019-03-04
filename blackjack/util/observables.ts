module ChatData {
    // Observable
    export class Observable<T> {
        protected value: T;
        protected valueListeners: Array<ValueListener<T>> = [];

        constructor(value: T);
        constructor(value: T) {
            this.value = value;
        }

        set(nvalue: T): void {
            let ovalue = this.value;
            this.value = nvalue;
            if (nvalue !== ovalue) {
                this.fireChange(nvalue);
            }
        }
        get(): T {
            return this.value;
        }
        fireChange(nvalue: T): void {
            for (let listener of this.valueListeners) {
                listener(nvalue);
            }
        }
        onChange(callback: ValueListener<T>): void {
            this.valueListeners.push(callback);
        }
        unsubscribe(callback: ValueListener<T>): void {
            this.valueListeners = this.valueListeners.filter((item) => {
                if (item !== callback) return item;
            });
        }


        store(): boolean {
            return false;
        }
        load(): boolean {
            return false;
        }
    }
    export class NamedObservable<T> extends Observable<T> {
        protected static readonly namedInstances: Map<string, NamedObservable<any>> = new Map();

        protected readonly name: string;

        constructor(value: T, name: string) {
            super(value);
            this.name = name;
            NamedObservable.namedInstances.set(this.name, this);
        }

        getName(): string {
            return this.name;
        }

        static storeAll(): void {
            this.namedInstances.forEach((obv, name) => obv.store());
        }
        static loadAll(): void {
            this.namedInstances.forEach((obv, name) => obv.load());
        }
        static byName(name: string): NamedObservable<any> | undefined {
            return this.namedInstances.get(name);
        }
    }

    export abstract class PersistentObservable<T> extends NamedObservable<T> {
        protected readonly encoder: Encoder<T>;

        constructor(value: T, name: string, encoder: Encoder<T> = Encoder.detect<T>(value) as Encoder<T>) {
            super(value, name);
            this.encoder = encoder;
        }

        protected getCode(): string {
            return this.encoder.encode(this.value);
        }
        protected setCode(code: string): void {
            this.set(this.encoder.decode(code));
        }
        abstract store(): boolean;
        abstract load(): boolean;
    }

    export class DefaultedObservable<T> extends PersistentObservable<T> {
        protected readonly defaultValue: Observable<T>;

        constructor(value: T, name: string, defaultValue: Observable<T>, encoder: Encoder<T> = Encoder.detect<T>(value) as Encoder<T>) {
            super(value, name, encoder);
            this.defaultValue = defaultValue;
        }
        store(): boolean {
            if (this.value === this.defaultValue.get()) {
                URIStorage.delete(this.name);
                return true;
            } else {
                URIStorage.set(this.name, this.encoder.encode(this.value));
                return true;
            }
        }
        load(): boolean {
            let code = URIStorage.get(this.name);
            if (code !== undefined) {
                this.setCode(code);
                return true;
            } else if (this.defaultValue !== undefined) {
                this.defaultValue.load();
                this.set(this.defaultValue.get());
                return true;
            } else {
                return false;
            }
        }
    }

    export class URIObservable<T> extends PersistentObservable<T> {
        constructor(value: T, name: string, encoder: Encoder<T> = Encoder.detect<T>(value) as Encoder<T>) {
            super(value, name, encoder);
        }
        store(): boolean {
            URIStorage.set(this.name, this.encoder.encode(this.value));
            return true;
        }
        load(): boolean {
            let code = URIStorage.get(this.name);
            if (code !== undefined) {
                this.setCode(code);
                return true;
            } else {
                return false; //don't load
            }
        }
    }

    export class HTMLObservable<T> extends PersistentObservable<T> {
        constructor(value: T, name: string, encoder: Encoder<T> = Encoder.detect<T>(value) as Encoder<T>) {
            super(value, name, encoder);
        }
        store(): boolean {
            HTMLStorage.set(this.name, this.encoder.encode(this.value));
            return true;
        }
        load(): boolean {
            let code = HTMLStorage.get(this.name);
            if (code !== undefined) {
                this.setCode(code);
                return true;
            } else {
                return false; //don't load
            }
        }
    }

    export interface ValueListener<T> {
        (nvalue: T): void;
    }

    // Storage 

    export abstract class Encoder<T> {
        abstract encode(value: T): string;
        abstract decode(code: string): T;

        static readonly number: Encoder<number> = {
            encode: (value: number): string => value.toString(),
            decode: (code: string): number => Number.parseFloat(code)
        };
        static readonly boolean: Encoder<boolean> = {
            encode: (value: boolean): string => (value ? '1' : '0'),
            decode: (code: string): boolean => (code === '1')
        };
        static readonly string: Encoder<string> = {
            encode: (value: string): string => value,
            decode: (code: string): string => code
        };

        static detect<T>(value: T): Encoder<any> | undefined {
            if (typeof value === 'number') return Encoder.number;
            if (typeof value === 'boolean') return Encoder.boolean;
            if (typeof value === 'string') return Encoder.string;
            return undefined;
        }
    }

    export abstract class Storage {
        protected readonly internal: Map<string, string> = new Map();
        protected container: Observable<string>;
        protected serialized: string | undefined;

        constructor(container: Observable<string>) {
            this.container = container;
            this.container.onChange((nvalue) => this.onSerializationChanged(nvalue));
            this.serialized = undefined;
        }

        onSerializationChanged(nvalue: string) {
            if (nvalue !== this.serialized) {
                this.internal.clear;
                this.load();
            }
        }

        abstract load(): void;
        abstract store(): void;

        set(key: string, value: string): void  {
            this.internal.set(key, value);
        }
        delete(key: string): void {
            this.internal.delete(key);
        }
        get(key: string): string | undefined {
            return this.internal.get(key);
        }
    }

    namespace HTMLStorage {
        const htmlStorageContent: NamedObservable<string> = new NamedObservable("", "name");
        const internal: Map<string, string> = new Map();

    }
}

