"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestManager = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const util_1 = require("../../util");
const config_1 = require("../../util/config");
const baseurl = config_1.config.apiUrl;
class RequestManager {
    constructor({ suburl }) {
        this._logging = false;
        this._requests = {};
        this._url = suburl ? `${baseurl}/${suburl}` : baseurl;
        this._instance = axios_1.default.create({
            baseURL: this._url,
            timeoutErrorMessage: 'Timed Out',
        });
        this._instance.interceptors.response.use((response) => response.data, (error) => {
            var _a, _b;
            if (!error.response)
                return Promise.reject('Timed Out');
            else
                return Promise.reject((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message);
        });
        this._instance.post;
    }
    addRequest(name, path, method, options = {}) {
        this._requests[name] = {
            path: path,
            method: method,
            options: options,
        };
    }
    sendRequest(name, props, config = {}) {
        return new Promise((resolve, reject) => {
            if (!this._requests[name]) {
                throw new Error("Request hasn't been added yet");
            }
            let { method, path, options = {} } = this._requests[name];
            Object.entries(props || {}).forEach(([key, value]) => {
                if (key.toLowerCase() !== 'authorization' && key.toLowerCase() !== 'body') {
                    path = path.replace(`%${key}`, `${value}`);
                }
            });
            const token = (props && props.authorization) || null;
            config.headers = Object.assign(Object.assign(Object.assign({}, config.headers), options), { Authorization: `Bearer ${token}` });
            switch (method) {
                case 'POST': {
                    this._instance
                        .post(path, props.body.formData ? props.body.formData : (props && props.body) || {}, config)
                        .then(resolve)
                        .then(() => this._logging && util_1.Logger.Request(name))
                        .catch(reject);
                    break;
                }
                case 'PUT': {
                    this._instance
                        .put(path, props.body.formData ? props.body.formData : (props && props.body) || {}, config)
                        .then(resolve)
                        .then(() => this._logging && util_1.Logger.Request(name))
                        .catch(reject);
                    break;
                }
                case 'DELETE': {
                    this._instance
                        .delete(path, config)
                        .then(resolve)
                        .then(() => this._logging && util_1.Logger.Request(name))
                        .catch(reject);
                    break;
                }
                case 'GET': {
                    this._instance
                        .get(path, config)
                        .then(resolve)
                        .then(() => this._logging && util_1.Logger.Request(name))
                        .catch(reject);
                    break;
                }
            }
        });
    }
    get url() {
        return this._url;
    }
    enableLogging() {
        this._logging = true;
    }
}
exports.RequestManager = RequestManager;
