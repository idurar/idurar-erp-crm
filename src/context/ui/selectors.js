const contextSelectors = (state) => {
  return {
    isModalOpen: () => {
      return state.isModalOpen;
    },
    isPanelOpen: () => {
      return state.isPanelOpen;
    },
    isAccordionOpen: () => {
      return state.isAccordionOpen;
    },
  };
};

export default contextSelectors;
