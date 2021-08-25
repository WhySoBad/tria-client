export declare class Collection<Id extends string, Value extends object> {
    private _map;
    constructor(values?: Map<Id, Value>);
    [Symbol.iterator](): {
        next: () => {
            value: [Id, Value];
            done: boolean;
        };
    };
    forEach(handler: (value: Value, id: Id) => void): void;
    get(id: Id): Value | undefined;
    has(id: Id): boolean;
    values(): Array<Value>;
    keys(): Array<Id>;
    entries(): Array<[Id, Value]>;
    toMap(): Map<Id, Value>;
    get size(): number;
}
