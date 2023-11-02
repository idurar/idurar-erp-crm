import React from 'react';
import { Row, Col } from 'antd';

const CollapseBoxButton = ({ onChange, title }) => {
  return (
    <div className="collapseBoxHeader" onClick={onChange}>
      {title}
    </div>
  );
};

const TopCollapseBox = ({ isOpen, children }) => {
  const show = isOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return (
    <div className="TopCollapseBox">
      <div style={show}>
        <Row>
          <Col span={24}> {children}</Col>
        </Row>
      </div>
    </div>
  );
};

const BottomCollapseBox = ({ isOpen, children }) => {
  const show = isOpen ? { display: 'none', opacity: 0 } : { display: 'block', opacity: 1 };
  return (
    <div className="BottomCollapseBox">
      <div style={show}>
        <Row>
          <Col span={24}> {children}</Col>
        </Row>
      </div>
    </div>
  );
};

export default function CollapseBox({
  topContent,
  bottomContent,
  buttonTitle,
  isCollapsed,
  onCollapse,
}) {
  const collapsed = isCollapsed ? 'collapsed' : '';
  return (
    <>
      <TopCollapseBox isOpen={isCollapsed}>{topContent}</TopCollapseBox>
      <div className={'collapseBox ' + collapsed}>
        <CollapseBoxButton title={buttonTitle} onChange={onCollapse} />
        <div className="whiteBg"></div>
        <BottomCollapseBox isOpen={isCollapsed}>{bottomContent}</BottomCollapseBox>
      </div>
    </>
  );
}
