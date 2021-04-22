import React, { useState } from "react";
import { Button, Row, Col } from "antd";

const AccordionButton = ({ isOpen, onChange }) => {
  return <Button onClick={onChange}>click here to show accordion</Button>;
};

const AccordionContent = ({ isOpen, children }) => {
  const show = isOpen ? { display: "none" } : { display: "block" };
  return (
    <div style={show}>
      <Row>
        <Col span={24}> {children}</Col>
      </Row>
    </div>
  );
};

export default function Accordion({ children }) {
  const [state, setSate] = useState(false);

  const toogleAccordion = () => {
    setSate(!state);
  };

  return (
    <>
      <AccordionButton onChange={toogleAccordion} />
      <AccordionContent isOpen={state}>{children}</AccordionContent>
    </>
  );
}
