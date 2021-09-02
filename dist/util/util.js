"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorForUuid = exports.handleAction = exports.delay = exports.checkGroupTag = exports.checkUserMail = exports.checkUserTag = exports.getChatPreview = exports.getUserAvatar = exports.getUserPreview = exports.confirmPasswordReset = exports.validatePasswordReset = exports.requestPasswordReset = exports.verifyRegister = exports.validateRegister = exports.registerUser = exports.validateToken = exports.loginUser = exports.enableLogging = void 0;
const tslib_1 = require("tslib");
const crypto_js_1 = require("crypto-js");
const request_1 = require("../request");
const websocket_1 = require("../websocket");
let authManager;
let userManager;
let chatManager;
const initialize = () => {
    authManager = new request_1.AuthRequestManager();
    userManager = new request_1.UserRequestManager();
    chatManager = new request_1.ChatRequestManager();
};
initialize();
const enableLogging = () => {
    authManager.enableLogging();
    userManager.enableLogging();
    chatManager.enableLogging();
};
exports.enableLogging = enableLogging;
const loginUser = (credentials) => {
    return new Promise((resolve, reject) => {
        !authManager && initialize();
        authManager.sendRequest('LOGIN', { body: credentials }).then(resolve).catch(reject);
    });
};
exports.loginUser = loginUser;
const validateToken = (token) => {
    return new Promise((resolve, reject) => {
        !authManager && initialize();
        authManager
            .sendRequest('VALIDATE', { authorization: token })
            .then(resolve)
            .catch(reject);
    });
};
exports.validateToken = validateToken;
const registerUser = ({ password, username }) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('REGISTER', { body: { mail: username, password: password } })
            .then(resolve)
            .catch(reject);
    });
};
exports.registerUser = registerUser;
const validateRegister = (token) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('REGISTER_VALIDATE', { token: token })
            .then(resolve)
            .catch(reject);
    });
};
exports.validateRegister = validateRegister;
const verifyRegister = (token, data) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('REGISTER_VERIFY', {
            body: Object.assign({ token: token }, data),
        })
            .then(resolve)
            .catch(reject);
    });
};
exports.verifyRegister = verifyRegister;
const requestPasswordReset = (mail) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('PASSWORD_RESET', { body: { mail: mail } })
            .then(resolve)
            .catch(reject);
    });
};
exports.requestPasswordReset = requestPasswordReset;
const validatePasswordReset = (token) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('PASSWORD_RESET_VALIDATE', { token: token })
            .then(resolve)
            .catch(reject);
    });
};
exports.validatePasswordReset = validatePasswordReset;
const confirmPasswordReset = (token, password) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('PASSWORD_RESET_CONFIRM', {
            body: { token: token, password: password },
        })
            .then(resolve)
            .catch(reject);
    });
};
exports.confirmPasswordReset = confirmPasswordReset;
const getUserPreview = (uuid) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('GET_PREVIEW', { uuid: uuid })
            .then((_a) => {
            var { avatar } = _a, rest = tslib_1.__rest(_a, ["avatar"]);
            return resolve(Object.assign(Object.assign({}, rest), { color: exports.colorForUuid(uuid), avatarURL: avatar }));
        })
            .catch(reject);
    });
};
exports.getUserPreview = getUserPreview;
const getUserAvatar = (uuid) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('GET_AVATAR', { uuid: uuid })
            .then((data) => resolve(Buffer.from(data)))
            .catch(reject);
    });
};
exports.getUserAvatar = getUserAvatar;
const getChatPreview = (uuid) => {
    return new Promise((resolve, reject) => {
        !chatManager && initialize();
        chatManager
            .sendRequest('GET_PREVIEW', { uuid: uuid })
            .then((_a) => {
            var { avatar } = _a, rest = tslib_1.__rest(_a, ["avatar"]);
            return resolve(Object.assign(Object.assign({}, rest), { color: exports.colorForUuid(uuid), avatarURL: avatar }));
        })
            .catch(reject);
    });
};
exports.getChatPreview = getChatPreview;
const checkUserTag = (tag) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('CHECK_TAG', { tag: tag })
            .then((value) => resolve(value))
            .catch(reject);
    });
};
exports.checkUserTag = checkUserTag;
const checkUserMail = (mail) => {
    return new Promise((resolve, reject) => {
        !userManager && initialize();
        userManager
            .sendRequest('CHECK_MAIL', { mail: mail })
            .then((value) => resolve(value))
            .catch(reject);
    });
};
exports.checkUserMail = checkUserMail;
const checkGroupTag = (tag) => {
    return new Promise((resolve, reject) => {
        !chatManager && initialize();
        chatManager
            .sendRequest('CHECK_TAG', { tag: tag })
            .then((value) => resolve(value))
            .catch(reject);
    });
};
exports.checkGroupTag = checkGroupTag;
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(() => resolve, ms));
};
exports.delay = delay;
const handleAction = (client, actionUuid) => {
    return new Promise((resolve, reject) => {
        const handleSuccess = (uuid) => {
            if (actionUuid === uuid) {
                client.raw.removeListener(websocket_1.SocketEvent.ACTION_ERROR, handleError);
                client.raw.removeListener(websocket_1.SocketEvent.ACTION_SUCCESS, handleSuccess);
                resolve();
            }
        };
        const handleError = (_a) => {
            var { uuid } = _a, error = tslib_1.__rest(_a, ["uuid"]);
            if (actionUuid === uuid) {
                client.raw.removeListener(websocket_1.SocketEvent.ACTION_ERROR, handleError);
                client.raw.removeListener(websocket_1.SocketEvent.ACTION_SUCCESS, handleSuccess);
                reject(error.message);
            }
        };
        client.raw.on(websocket_1.SocketEvent.ACTION_ERROR, handleError);
        client.raw.on(websocket_1.SocketEvent.ACTION_SUCCESS, handleSuccess);
    });
};
exports.handleAction = handleAction;
const colorForUuid = (uuid) => {
    const h = parseInt(Number('0x' + crypto_js_1.SHA256(uuid).toString().substr(0, 6)).toString(), 10) / 16777215;
    const s = 1;
    const l = 0.65;
    const convertHue = (p, q, t) => {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const [r, g, b] = [
        convertHue(p, q, h + 1 / 3),
        convertHue(p, q, h),
        convertHue(p, q, h - 1 / 3),
    ].map((x) => Math.round(x * 255));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
exports.colorForUuid = colorForUuid;
