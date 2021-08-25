import { SearchOptions } from '../../client';
import { RequestManager } from './RequestManager.class';
interface SearchRequests {
    SEARCH: {
        authorization: string;
        body: SearchOptions;
    };
}
export declare class SearchRequestManager extends RequestManager<SearchRequests> {
    constructor();
}
export {};
