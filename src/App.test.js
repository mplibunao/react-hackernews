import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import App, { Search, Button, Table, Loading } from './App';

describe('App', ()=>{

  /**
   *  @ Default test for create-react-app
   *  Renders the component and its children to a div element
   */
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  /**
   *  @ Snapshot Test
   *  Makes a snapshot of your rendered component and runs this snapshot against future snapshots
   *  Notifies you of any changes and asks if you want to update the snapshot
   */
  test('snapshots', ()=>{
    const component = renderer.create(
      <App />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

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

describe('Button', ()=>{

  it('renders', ()=>{
    const div = document.createElement('div');
    ReactDOM.render(<Button>Give Me More</Button>, div);
  });

  test('snapshots', ()=>{
    const component = renderer.create(
      <Button>Give Me More</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Loading', ()=>{
  
  it('renders', ()=>{
    const div = document.createElement('div');
    ReactDOM.render(<Loading />, div);
  });

  test('snapshots', ()=>{
    const component = renderer.create(
      <Loading />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Table', ()=>{

  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ]
  };

  /** 
   *  @ Unit Test 
   *  Use shallow to render component and assert that Table has two items
   *  - Shallow renders the component without child components. You can make the test dedicated to one component
   *  - Enzyme has two other rendering mechanisms: mount() and render()
   *  Both creates instances of the parent component and all child components
   *  However mount() gives you more access to the component lifecycle methods
   * 
   *  Rule of thumb:
   *  - Always begin with a shallow test
   *  - If componentDidMount() or componentDidUpdate() should be tested, use mount()
   *  - If you want to test component lifecycle and children behavior, use mount()
   *  - If you want to test children with less overhead than mount() and you are not interested in lifecycle methods, use render()
   */ 
  it('shows two items in list', ()=>{
    const element =  shallow(
      <Table {...props} />
    );

    expect(element.find('.table-row').length).toBe(2);
  });

  it('renders', ()=>{
    const div = document.createElement('div');
    ReactDOM.render(<Table {...props} />, div);
  });

  test('snapshots', ()=>{
    const component = renderer.create(
      <Table {...props} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

