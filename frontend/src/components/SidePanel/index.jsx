import { useState, useEffect } from 'react';
import { useCrudContext } from '@/context/crud';
import { useAppContext } from '@/context/appContext';
import { Grid, Layout, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import CollapseBox from '../CollapseBox';

const { useBreakpoint } = Grid;
const { Sider } = Layout;

export default function SidePanel({ config, topContent, bottomContent, fixHeaderPanel }) {
  const screens = useBreakpoint();

  const { ADD_NEW_ENTITY } = config;
  const { state, crudContextAction } = useCrudContext();
  const { isPanelClose, isBoxCollapsed } = state;
  const { panel, collapsedBox } = crudContextAction;
  const [isSidePanelClose, setSidePanel] = useState(isPanelClose);
  const [leftSider, setLeftSider] = useState('-1px');
  const [opacitySider, setOpacitySider] = useState(0);
  const [paddingTopSider, setPaddingTopSider] = useState('20px');

  // const { state: stateApp, appContextAction } = useAppContext();
  // const { isNavMenuClose } = stateApp;
  // const { navMenu } = appContextAction;

  useEffect(() => {
    let timer = [];
    if (isPanelClose) {
      setOpacitySider(0);
      setPaddingTopSider('20px');

      timer = setTimeout(() => {
        setLeftSider('-1px');
        setSidePanel(isPanelClose);
      }, 200);
    } else {
      setSidePanel(isPanelClose);
      setLeftSider(0);
      timer = setTimeout(() => {
        setOpacitySider(1);
        setPaddingTopSider(0);
      }, 200);
    }

    return () => clearTimeout(timer);
  }, [isPanelClose]);

  const collapsePanel = () => {
    panel.collapse();
  };

  const collapsePanelBox = () => {
    collapsedBox.collapse();
  };

  return (
    <Drawer
      title={config.PANEL_TITLE}
      placement="right"
      onClose={collapsePanel}
      open={!isPanelClose}
      width={450}
    >
      <div
        className="sidePanelContent"
        style={{
          opacity: opacitySider,
          paddingTop: paddingTopSider,
        }}
      >
        {fixHeaderPanel}
        <CollapseBox
          buttonTitle={ADD_NEW_ENTITY}
          isCollapsed={isBoxCollapsed}
          onCollapse={collapsePanelBox}
          topContent={topContent}
          bottomContent={bottomContent}
        ></CollapseBox>
      </div>
    </Drawer>
    // <Sider
    //   width={screens.md ? '400px' : '95%'}
    //   collapsed={isSidePanelClose}
    //   collapsedWidth={'0px'}
    //   onCollapse={collapsePanel}
    //   className="sidePanel"
    //   zeroWidthTriggerStyle={{
    //     right: '-50px',
    //     top: '15px',
    //   }}
    //   style={{
    //     left: leftSider,
    //     zIndex: '100',
    //   }}
    // >

    // </Sider>
  );
}
