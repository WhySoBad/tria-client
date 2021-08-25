"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRequestManager = void 0;
const RequestManager_class_1 = require("./RequestManager.class");
class SearchRequestManager extends RequestManager_class_1.RequestManager {
    constructor() {
        super({ suburl: 'search' });
        this.addRequest('SEARCH', '', 'POST');
    }
}
exports.SearchRequestManager = SearchRequestManager;
