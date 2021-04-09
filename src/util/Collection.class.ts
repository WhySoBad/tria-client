/**
 * The Collection class is used to return a Map without
 *
 * allowing the user to edit the map
 */

export class Collection<Id extends string, Value extends object> {
  private _map: Map<Id, Value> = new Map<Id, Value>();

  constructor(values?: Map<Id, Value>) {
    if (values) this._map = values;
    this._map.has;
  }

  [Symbol.iterator]() {
    let index: number = 0;

    return {
      next: () => ({ value: this.entries()[++index], done: !(index in this.entries()) }),
    };
  }

  /**
   * For each iterator which iterates over every value in the collection
   *
   * @param handler handler for the entries
   *
   * @returns void
   */

  public forEach(handler: (value: Value, id: Id) => void): void {
    this._map.forEach(handler);
  }

  /**
   * Get specific value of the collection
   *
   * @param id id of the value
   *
   * @returns Value | undefined
   */

  public get(id: Id): Value | undefined {
    return this._map.get(id);
  }

  /**
   * Check whether the given id exists in the collection
   *
   * @param id id of the value
   *
   * @returns boolean
   */

  public has(id: Id): boolean {
    return !!this.get(id);
  }

  /**
   * Get all values of the collection
   *
   * @returns Array<Value>
   */

  public values(): Array<Value> {
    return [...this._map.values()];
  }

  /**
   * Get all keys of the collection
   *
   * @returns Array<Id>
   */

  public keys(): Array<Id> {
    return [...this._map.keys()];
  }

  /**
   * Get all keys with the corresponding value
   *
   * @returns Array<[Id, Value]>
   */

  public entries(): Array<[Id, Value]> {
    return [...this._map.entries()];
  }

  /**
   * Get a Map instance of the Collection
   *
   * @returns Map<Id, Value>
   */

  public toMap(): Map<Id, Value> {
    return this._map;
  }

  /**
   * Amount of entries in the collection
   */

  public get size(): number {
    return this._map.size;
  }
}
