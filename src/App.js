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
      The ()=> is bound to the class and thus becomes a class method
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
    return (
      <div className="App">
        <form>
          <input
            type="text"
            onChange={this.onSearchChange}
          />
        </form>
        {this.state.list.map( item =>
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <button
                  onClick={()=> this.onDismiss(item.objectID)}
                  type="button"
                >
                  Dismiss
                </button>
              </span>
            </div>
        )}
      </div>
    );
  }
}

export default App;
