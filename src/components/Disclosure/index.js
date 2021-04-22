import React, { useState, useCallback, useMemo } from "react";

const Disclosure = styled("button")(
  {
    textAlign: "left",
    minWidth: 80,
    cursor: "pointer",
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    border: "none",
    backgroundColor: "unset",
    ":focus": {
      outline: "none",
      backgroundColor: "rgba(255, 255, 255, 0.4)",
    },
  },
  ({ isOpen }) =>
    isOpen
      ? {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }
      : null
);

const PoseAccordionContents = posed.div({
  open: { maxHeight: 200 },
  closed: { maxHeight: 0 },
});

function AccordionContents({ isOpen, ...props }) {
  return (
    <PoseAccordionContents
      pose={isOpen ? "open" : "closed"}
      css={{ overflowY: "hidden", textAlign: "justify" }}
      {...props}
    />
  );
}

export default function Disclosure() {
  return <div></div>;
}
