import { ChatConstructor } from '.';
import { ChatRole } from './Member.types';

export interface GroupConstructor extends ChatConstructor {}

export interface GroupProps {
  /**
   * Name of the group
   */

  name: string;

  /**
   * Unique tag of the group
   */

  tag: string;

  /**
   * Description of the group
   */

  description: string;

  /**
   * Members of the group
   */

  members?: Array<{ uuid: string; role: ChatRole }>;
}
