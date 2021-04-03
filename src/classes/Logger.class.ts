export class Logger {
  public static Error(...args: Array<any>) {
    const prefix: string = '[\u001b[31mError\u001b[37m]';
    console.log(prefix, ...args);
  }
  public static Event(...args: Array<any>) {
    const prefix: string = '[\u001b[32mEvent\u001b[37m]';
    console.log(prefix, ...args);
  }
  public static Info(...args: Array<any>) {
    const prefix: string = '[\u001b[34mInfo\u001b[37m]';
    console.log(prefix, ...args);
  }
  public static Warning(...args: Array<any>) {
    const prefix: string = '[\u001b[33mWarning\u001b[37m]';
    console.log(prefix, ...args);
  }
  public static Request(...args: Array<any>) {
    const prefix: string = '[\u001b[35mRequest\u001b[37m]';
    console.log(prefix, ...args);
  }
  public static Log(...args: Array<any>) {
    const prefix: string = '[\u001b[34mLog\u001b[37m]';
    console.log(prefix, ...args);
  }
}
