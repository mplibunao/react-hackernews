import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SORTS, updateSortState, caretClass } from './helpers';
import Sort from '../Sort/';
import Button from '../Button/';

class Table extends Component {
  constructor(props){
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,

    };

    this.onSort = this.onSort.bind(this);
  }

  /**
   * onSort
   * @param {String} sortKey - Category used in sorting results
   * Passes a higher order function to setState which updates the state
   * When you change sort categories, the sortKey === sortKey will automatically return false thus sort normally
   * When it is the same you just flip the previous sortOrder (until you change categories)
   */
  onSort(sortKey){
    this.setState(updateSortState(sortKey));
    //const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    //this.setState({ sortKey, isSortReverse });
  }

  render(){

    const { list, onDismiss, showComment } = this.props;
    const { sortKey, isSortReverse } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    const sortClass = caretClass(isSortReverse);

    return (
      <div className="table">
        {/** Table Header **/}
        <div className="table-header">
          <span style={{ width: '40%'}}>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Title <i className={sortClass}></i>
            </Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Author <i className={sortClass}></i>
            </Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Comment Num <i className={sortClass}></i>
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points <i className={sortClass}></i>
            </Sort>
          </span>
          <span style={{ width: '10%'}}>
            Comments
          </span>
          <span style={{ width: '10%'}}>
            Archive
          </span>
        </div>

        {/** Table Body **/}
        { reverseSortedList.map( item =>
          <div key={item.objectID}>
            <div className="table-row">
              <span style={{ width: '40%' }}>
                <a href={item.url}>{item.title}</a>
              </span>
              <span style={{ width: '15%' }}>
                {item.author}
              </span>
              <span style={{ width: '15%' }}>
                {item.num_comments}
              </span>
              <span style={{ width: '10%' }}>
                {item.points}
              </span>
              <span style={{ width: '10%' }}>
                <Button
                  className="button-inline"
                  onClick={()=> showComment(item.objectID)}
                >
                  Show
                </Button>
              </span>
              <span style={{ width: '10%' }}>
                <Button
                  onClick={()=> onDismiss(item.objectID)}
                  className="button-inline"
                  >
                  Dismiss
                </Button>
              </span>
            </div>
            <div className={{width: '100%'}}>
              <span className={{width: '100%'}}>Sup</span>
            </div>
          </div> 
        )}
      </div>
    );
  }
}

Table.PropTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default Table;