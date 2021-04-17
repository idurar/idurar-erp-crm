const contextSelector = (state) => {
  return {
    count: () => {
      return state.count;
    },
  };
};

export default contextSelector;
