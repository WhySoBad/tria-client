export class Logger {
  public static Error(error: any) {
    const prefix: string = '[\u001b[31mError\u001b[37m]';
    console.log(`${prefix} ${error}`);
  }
  public static Event(event: any) {
    const prefix: string = '[\u001b[32mEvent\u001b[37m]';
    console.log(`${prefix} ${event}`);
  }
  public static Info(info: any) {
    const prefix: string = '[\u001b[34mInfo\u001b[37m]';
    console.log(`${prefix} ${info}`);
  }
  public static Warning(warning: any) {
    const prefix: string = '[\u001b[33mWarning\u001b[37m]';
    console.log(`${prefix} ${warning}`);
  }
  public static Request(request: any) {
    const prefix: string = '[\u001b[35mRequest\u001b[37m]';
    console.log(`${prefix} ${request}`);
  }
  public static Log(message: any) {
    const prefix: string = '[\u001b[34mLog\u001b[37m]';
    console.log(`${prefix} ${message}`);
  }
}
