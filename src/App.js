import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

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
      list,
      searchTerm: '',
    };

    /*
      The function is bound to the class and thus becomes a class method
      Need to bind class methods in the constructor; Binds `this` to class
    */
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
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
    const { searchTerm, list } = this.state;

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
            list={list}
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
