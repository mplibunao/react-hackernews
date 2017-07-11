import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

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
const isSearched = (searchTerm) => (item) =>
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());



class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    /*
      The function is bound to the class and thus becomes a class method
      Need to bind class methods in the constructor; Binds `this` to class
    */
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result){
    this.setState({ result });
  }

  fetchSearchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  // Make API Request after initial rendering of component
  componentDidMount(){
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onDismiss(id){
    const newList = this.state.list.filter(item => item.objectID !== id);
    this.setState({list: newList});
  }

  // Pass synthetic event to class method to access the event payload
  onSearchChange(event){
    this.setState({searchTerm: event.target.value });
  }

  render() {
    console.log(this.state);
    const { searchTerm, result } = this.state;

    if (!result){
      return null;
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        
      </div>
    );
  }
}

/*
  You can only use concise body functions if you only have one expression
  In this case, this element tree is considered as one
  If you assign the props values to variable inside the function, that's more than one expression
*/
const Search = ({value, onChange, children}) =>
  <form>
    {children} <input
      type="text"
      onChange={onChange}
      // set the value so the element doesn't handle its own state (uncontrolled components)
      value={value}
    />
  </form>

const Table = ({ list, pattern, onDismiss }) =>
<div className="table">
  { list.filter(isSearched(pattern)).map( item =>
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
