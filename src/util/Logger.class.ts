export class Logger {
  /**
   * Integrated error logger
   *
   * @param args log output
   *
   * @returns void
   */

  public static Error(...args: Array<any>): void {
    const prefix: string = '[\u001b[31mError\u001b[37m]';
    console.log(prefix, ...args);
  }

  /**
   * Integrated event logger
   *
   * @param args log output
   *
   * @returns void
   */

  public static Event(...args: Array<any>): void {
    const prefix: string = '[\u001b[32mEvent\u001b[37m]';
    console.log(prefix, ...args);
  }

  /**
   * Integrated info logger
   *
   * @param args log output
   *
   * @returns void
   */

  public static Info(...args: Array<any>): void {
    const prefix: string = '[\u001b[34mInfo\u001b[37m]';
    console.log(prefix, ...args);
  }

  /**
   * Integrated warning logger
   *
   * @param args log output
   *
   * @returns void
   */

  public static Warning(...args: Array<any>): void {
    const prefix: string = '[\u001b[33mWarning\u001b[37m]';
    console.log(prefix, ...args);
  }

  /**
   * Integrated request logger
   *
   * @param args log output
   *
   * @returns void
   */

  public static Request(...args: Array<any>): void {
    const prefix: string = '[\u001b[35mRequest\u001b[37m]';
    console.log(prefix, ...args);
  }

  /**
   * Integrated logger
   *
   * @param args log output
   *
   * @returns void
   */

  public static Log(...args: Array<any>): void {
    const prefix: string = '[\u001b[34mLog\u001b[37m]';
    console.log(prefix, ...args);
  }
}
