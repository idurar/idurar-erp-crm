const contextSelectors = (state) => {
  return {
    isModalOpen: () => {
      return state.isModalOpen;
    },
    isPanelOpen: () => {
      return state.isPanelOpen;
    },
    isBoxOpen: () => {
      return state.isBoxOpen;
    },
  };
};

export default contextSelectors;
