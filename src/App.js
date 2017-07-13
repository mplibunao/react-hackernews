import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '20';
//const DEFAULT_TAGS = 'story';
const DEFAULT_TAGS = 'story';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search_by_date';
const PARAM_SEARCH = 'query=';
const TAG_SEARCH = 'tags=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
// Query for comments of a particular story
// https://hn.algolia.com/api/v1/search_by_date?tags=comment,story_14743596&page=0&hitsPerPage=20
// story_xxxx = `story_${hits.objectID}`

// Object containing the different sort functions by category
const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  // get values from prevState instead of this.state
  const { searchKey, results } = prevState;
  // && acts as a gate to stop result from accessing non-existent searchKey index
  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];
  const updatedHits = [...oldHits, ...hits];

  // return value is the new state we're setting
  return {
    results: {
      ...results,
      // concat at the end of the map the latest results
      [searchKey]: { hits: updatedHits, page}
    },
    isLoading: false,
  };
};

//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

/*
// Remember filter takes in value/item as parameter
// However we can't access searchterm from the scope (state), which we need for the conditional statament of the filter
// So we have to pass searchTerm as a parameter but that would ruin our filter function
// So we create a function which accepts the searchTerm state value then return a regular filter function

function isSearched(searchTerm){
  returns function(item){
    return !searchTerm || item.title.includes(searchTerm);
  }
}
// - !searchTerm is used to prematurely stop the filter and avoid checking the 2nd condition if searchTerm is empty
// Instead, filter just passes the origin array to map (since it's false);
// This is to prevent comparing the list.title with the empty search term which could result in false and cut out the whole array

// - If searchTerm exist, then first condition is always false which makes the || check the 2nd condition
// - Remember, || goes left to right; stops if 1st condition is true; else check 2nd statement
*/ 

// Higher Order function
//const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    };

    /*
      The function is bound to the class and thus becomes a class method
      Need to bind class methods in the constructor; Binds `this` to class;
      By default, `this` inside elements point to a function not the class;
      Problem seems to arise when you pass these functions down to child components (this === undefined)
      This is a better alternative to calling `this.onDismiss` inside an arrow function since an arrow function is made every
        render which pile up and force the garbage collection to clean them (expensive)
    */
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.setState({searchKey: searchTerm});
    // If false, we don't fetch data and we just rerender (because of setState) which loads the right data because of searchKey
    if (this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
    }
    
    event.preventDefault();
  }

  // Concatenate recently fetched hits with previous hits
  setSearchTopStories({hits, page}){
    // pass a higher order function which returns a callback responsible for altering the state 'safely'
    this.setState(updateSearchTopStoriesState(hits, page))
  }

  fetchSearchTopStories(searchTerm, page){
    this.setState({ isLoading: true});
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${TAG_SEARCH}${DEFAULT_TAGS}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  // Make API Request after initial rendering of component
  componentDidMount(){
    const { searchTerm } = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id){
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    // Filter function
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page}
      }
    });
  }

  // Pass synthetic event to class method to access the event payload
  onSearchChange(event){
    this.setState({searchTerm: event.target.value });
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      isLoading,
    } = this.state;

    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
          <div className="interactions">
            <ButtonWithLoading
              isLoading={isLoading}
              onClick={()=> this.fetchSearchTopStories(searchKey, page+1)}>
              More
            </ButtonWithLoading>
          </div>  
      </div>
    );
  }
}


/*
  You can only use concise body functions if you only have one expression
  In this case, this element tree is considered as one
  If you assign the props values to variable inside the function, that's more than one expression
*/
class Search extends Component{

  render() {
    const {
      value,
      onChange,
      onSubmit,
      children
    } = this.props;
    
    return(
      <form onSubmit={onSubmit}>
        {children} <input
          type="text"
          onChange={onChange}
          // set the value so the element doesn't handle its own state (uncontrolled components)
          value={value}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}

Search.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

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
   * When you change sort categories, the sortKey === sortKey will automatically return false thus sort normally
   * When it is the same you just flip the previous sortOrder (until you change categories)
   */
  onSort(sortKey){
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render(){

    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

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
              Title
            </Sort>
          </span>
          <span style={{ width: '30%' }}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Comments
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
          <span style={{ width: '10%'}}>
            Archive
          </span>
        </div>

        {/** Table Body **/}
        { reverseSortedList.map( item =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '40%' }}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%' }}>
              {item.author}
            </span>
            <span style={{ width: '10%' }}>
              {item.num_comments}
            </span>
            <span style={{ width: '10%' }}>
              {item.points}
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


const Button = ({onClick, className, children})=>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.PropTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  className: '',
};

// Loading component
const Loading = ()=>
  <i className="fa fa-spinner fa-spin"></i>

// Higher Order Component returning a functional stateless component
const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />

/**
 * Store the returned functional component ({ isLoading, ...rest }) in variable
 * which has closure to Component argument (Button)
 */
const ButtonWithLoading = withLoading(Button);

// Reuse the Button component
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


export default App;

export {
  Button,
  Search,
  Table,
  Loading,
  Sort,
};