
/**
 *  Higher Order Function that returns a callback function passed to setState
 *  This callback function is in charge of altering the state 
 */
const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  // get values from prevState instead of this.state
  const { searchKey, results } = prevState;
  // && acts as a gate to stop result from accessing non-existent searchKey index
  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];
  const updatedHits = [...oldHits, ...hits];

  // return value is the new state we're setting
  return {
    results: {
      ...results,
      // concat at the end of the map the latest results
      [searchKey]: { hits: updatedHits, page}
    },
    isLoading: false,
  };
};

export { updateSearchTopStoriesState };