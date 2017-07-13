import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App, { withLoading, ButtonWithLoading } from './App';

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


