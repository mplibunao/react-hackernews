import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from '../Button/';

const Sort = ({
  onSort,
  sortKey,
  children,
  activeSortKey
}) => { 
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );
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
  children: PropTypes.node.isRequired,
  activeSortKey: PropTypes.string.isRequired,
}

Sort.DefaultProps = {
  sortKey: 'NONE',
  activeSortKey: 'NONE',
}

export default Sort;