import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Search from '../Search/';
import Table from '../Table/';
import Button from '../Button/';
import Loading from '../Loading/';

import './App.css';
import { updateSearchTopStoriesState } from './helpers';
import {
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  DEFAULT_TAGS,

  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  TAG_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from '../../constants/';

//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

/**
 * withLoading
 * @param {Component} Component
 * Higher Order Component that returns a functional stateless component
 * Inner functional component breaksdown props into two parts: One for conditional conditional rendering, one for props
 * Depending on isLoading value, either renders Loading Component or Component passed in the outer function (closure)
 */
const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />

/**
 * ButtonWithLoading
 * Store the returned functional component ({ isLoading, ...rest }) in variable
 * which has closure to Component argument (Button)
 */
const ButtonWithLoading = withLoading(Button);

ButtonWithLoading.PropTypes = {
  isLoading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    };

    /**
     *  @ Binding Functions to the Class as Class methods
     *  - Need to bind class methods inside the constructor; Binds `this` to class;
     *  - By default, `this` inside elements point to a function not the class;
     *  - Problem arises when you pass these functions down to child components (this === undefined)
     *  - Better than onDismiss={ ()=> this.onDismiss() } on child component since arrow function is made every
     *    - render which pile up and force the garbage collection to clean them (expensive)
     */
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  // Make API Request after initial rendering of component
  componentDidMount(){
    const { searchTerm } = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
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
    this.setState(updateSearchTopStoriesState(hits, page));
    console.log(this.state);
  }

  fetchSearchTopStories(searchTerm, page){
    this.setState({ isLoading: true});
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${TAG_SEARCH}${DEFAULT_TAGS}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
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

export default App;

export { withLoading, ButtonWithLoading  };