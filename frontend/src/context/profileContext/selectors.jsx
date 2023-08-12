const contextSelectors = (state) => {
  return {
    isModalOpen: () => {
      return state.isModalOpen;
    },
    isPanelOpen: () => {
      return state.isPanelOpen;
    },
  };
};

export default contextSelectors;
