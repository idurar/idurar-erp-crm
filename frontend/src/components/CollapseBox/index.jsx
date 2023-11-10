import React from 'react';
import { Row, Col } from 'antd';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { doesAdminHaveEditAccess } from '@/utils/helpers';
import { useSelector } from 'react-redux';

const CollapseBoxButton = ({ onChange, title }) => {
  const currentAdmin = useSelector(selectCurrentAdmin);
  return (
    <div
      className={`collapseBoxHeader ${
        currentAdmin && !doesAdminHaveEditAccess(currentAdmin) && 'buttonDisabled'
      }`}
      onClick={onChange}
    >
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
