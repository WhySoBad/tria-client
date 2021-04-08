export interface BannedMemberConstructor {
  /**
   * Date when the member was banned
   */

  bannedAt: Date;

  /**
   * User instance of the banned member
   */

  user: {
    /**
     * User uuid
     */

    uuid: string;

    /**
     * Date when the user was created
     */

    createdAt: Date;

    /**
     * Name of the user
     */

    name: string;

    /**
     * Tag of the user
     */

    tag: string;

    /**
     * Description of the user
     */

    description: string;

    /**
     * Avatar of the user
     */

    avatar: string | null;
  };
}
