import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Table from './';

describe('Table', ()=>{

  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
    sortKey: 'TITLE',
    isSortReverse: false,
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