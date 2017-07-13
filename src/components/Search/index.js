import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

export default Search;