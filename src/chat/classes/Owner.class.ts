import { OwnerConstructor } from '../types/Owner.types';
import { Member } from './Member.class';

export class Owner extends Member {
  constructor(constructor: OwnerConstructor) {
    super(constructor);
  }
}
