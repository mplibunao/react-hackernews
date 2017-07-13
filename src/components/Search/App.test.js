import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Search from './';

describe('Search', ()=>{

  it('renders', ()=>{
    const div = document.createElement('div');
    ReactDOM.render(<Search>Search</Search>, div);
  });

  test('snapshots', ()=>{
    const component = renderer.create(
      <Search>Search</Search>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});