import classNames from 'classnames';


export const isActiveSort = (sortKey, activeSortKey) => classNames(
  'button-inline',
  { 'button-active': sortKey === activeSortKey }
);
