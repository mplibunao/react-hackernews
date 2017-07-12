import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

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
    const { searchKey, results } = this.state;
    // && acts as a gate to stop result from accessing non-existent searchKey index
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {
        ...results,
        // concat at the end of the map the latest results
        [searchKey]: { hits: updatedHits, page}
      }
    });
  }

  fetchSearchTopStories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
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
    const { searchTerm, results, searchKey } = this.state;
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
        {/* Same as using ternary operator but much more confusing lol
        Like ||, starts with left expression but checks for false (not true)*/}
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
          <div className="interactions">
            <Button onClick={()=> this.fetchSearchTopStories(searchKey, page + 1)}>
              More
            </Button>
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
const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
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

const Table = ({ list, onDismiss }) =>
<div className="table">
  { list.map( item =>
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


class Button extends Component {
  render(){
    const {
      onClick,
      className = '',
      children,
    } = this.props;

    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    );
  }
}

export default App;
