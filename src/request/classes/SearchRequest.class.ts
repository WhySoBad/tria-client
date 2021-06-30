import { SearchOptions } from '../../client';
import { RequestManager } from './RequestManager.class';

interface SearchRequests {
  SEARCH: { authorization: string; body: SearchOptions };
}

/**
 * SearchRequestManager class to easily send auth requets
 */

export class SearchRequestManager extends RequestManager<SearchRequests> {
  constructor() {
    super({ suburl: 'search' });
    this.addRequest<'SEARCH'>('SEARCH', '', 'POST');
  }
}
