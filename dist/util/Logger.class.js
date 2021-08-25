"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static Error(...args) {
        const prefix = '[\u001b[31mError\u001b[37m]';
        console.log(prefix, ...args);
    }
    static Event(...args) {
        const prefix = '[\u001b[32mEvent\u001b[37m]';
        console.log(prefix, ...args);
    }
    static Info(...args) {
        const prefix = '[\u001b[34mInfo\u001b[37m]';
        console.log(prefix, ...args);
    }
    static Warning(...args) {
        const prefix = '[\u001b[33mWarning\u001b[37m]';
        console.log(prefix, ...args);
    }
    static Request(...args) {
        const prefix = '[\u001b[35mRequest\u001b[37m]';
        console.log(prefix, ...args);
    }
    static Log(...args) {
        const prefix = '[\u001b[34mLog\u001b[37m]';
        console.log(prefix, ...args);
    }
}
exports.Logger = Logger;
