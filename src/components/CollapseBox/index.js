import React, { useState } from "react";
import { Button, Row, Col } from "antd";

const CollapseBoxButton = ({ onChange, title }) => {
  return <Button onClick={onChange}>{title}</Button>;
};

const TopCollapseBox = ({ isOpen, children }) => {
  const show = isOpen ? { display: "block" } : { display: "none" };
  return (
    <div style={show}>
      <Row>
        <Col span={24}> {children}</Col>
      </Row>
    </div>
  );
};

const BottomCollapseBox = ({ isOpen, children }) => {
  const show = isOpen ? { display: "none" } : { display: "block" };
  return (
    <div style={show}>
      <Row>
        <Col span={24}> {children}</Col>
      </Row>
    </div>
  );
};

export default function CollapseBox({
  TopCollapseContent,
  BottoCollapseContent,
  ButtonTitle,
  isCollapsed,
  onCollapse,
}) {
  return (
    <>
      <TopCollapseBox isOpen={isCollapsed}>{TopCollapseContent}</TopCollapseBox>
      <CollapseBoxButton title={ButtonTitle} onChange={onCollapse} />
      <BottomCollapseBox isOpen={isCollapsed}>
        {BottoCollapseContent}
      </BottomCollapseBox>
    </>
  );
}
