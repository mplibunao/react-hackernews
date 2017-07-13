import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/';
import { isActiveSort } from './helpers';


const Sort = ({
  onSort,
  sortKey,
  children,
  activeSortKey
}) => { 

  const sortClass = isActiveSort(sortKey, activeSortKey);
  
  return (
    <Button
      onClick={ ()=> onSort(sortKey) }
      className={sortClass}
    >
      {children}
    </Button>
  );
}

Sort.PropTypes = {
  onSort: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  children: PropTypes.node,
  activeSortKey: PropTypes.string.isRequired,
}

Sort.DefaultProps = {
  sortKey: 'NONE',
  activeSortKey: 'NONE',
}

export default Sort;