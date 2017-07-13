

export const DEFAULT_QUERY = 'redux';
export const DEFAULT_PAGE = 0;
export const DEFAULT_HPP = '20';
//const DEFAULT_TAGS = 'story';
export const DEFAULT_TAGS = 'story';

export const PATH_BASE = 'https://hn.algolia.com/api/v1';
export const PATH_SEARCH = '/search_by_date';
export const PARAM_SEARCH = 'query=';
export const TAG_SEARCH = 'tags=';
export const PARAM_PAGE = 'page=';
export const PARAM_HPP = 'hitsPerPage=';

// Query for comments of a particular story
// https://hn.algolia.com/api/v1/search_by_date?tags=comment,story_14743596&page=0&hitsPerPage=20
// story_xxxx = `story_${hits.objectID}`

//https://hn.algolia.com/api/v1/search_by_date?tags=comment,story_14743596&page=0&hitsPerPage=20