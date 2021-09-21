"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
class Collection {
    constructor(values) {
        this._map = new Map();
        if (values)
            this._map = values;
    }
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => ({ value: this.entries()[++index], done: !(index in this.entries()) }),
        };
    }
    forEach(handler) {
        this._map.forEach(handler);
    }
    get(id) {
        return this._map.get(id);
    }
    has(id) {
        return !!this.get(id);
    }
    values() {
        return [...this._map.values()];
    }
    keys() {
        return [...this._map.keys()];
    }
    entries() {
        return [...this._map.entries()];
    }
    toMap() {
        return this._map;
    }
    get size() {
        return this._map.size;
    }
}
exports.Collection = Collection;
