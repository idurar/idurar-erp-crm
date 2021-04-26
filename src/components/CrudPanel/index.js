import React, { useLayoutEffect } from "react";
import { Button, PageHeader, Row, Statistic, Tag } from "antd";
import DataTable from "./DataTable";
import CreateModal from "./CreateModal";
import { useDispatch } from "react-redux";
import { resetCrudState } from "@/redux/crud/actions";
import { useUiContext } from "@/context/ui";
import uniqueId from "@/utils/uniqueId";

function AddNewItem() {
  const { uiContextAction } = useUiContext();
  return (
    <Button onClick={uiContextAction.panel.open} type="primary">
      Add new Customer
    </Button>
  );
}
export default function CrudPanel({ columns, entity, newForm }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(resetCrudState());
  }, []);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title="Customer Page"
        ghost={false}
        tags={<Tag color="blue">Running</Tag>}
        subTitle="This is customer page"
        extra={[
          <Button key={`${uniqueId()}`}>Refresh</Button>,
          <AddNewItem key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: "20px 0px",
        }}
      >
        <Row>
          <Statistic title="Status" value="Pending" />
          <Statistic
            title="Price"
            prefix="$"
            value={568.08}
            style={{
              margin: "0 32px",
            }}
          />
          <Statistic title="Balance" prefix="$" value={3345.08} />
        </Row>
      </PageHeader>
      <DataTable columns={columns} entity={entity} />
    </>
  );
}

// export default function DefaultLayout({ children, SidePanelContent }) {
//   return (
//     <MainDashboard>
//       <SidePanel>{SidePanelContent}</SidePanel>
//       <Layout className="site-layout">
//         <HeaderContent />
//         <Content
//           className="site-layout-background"
//           style={{
//             padding: "50px 40px",
//             margin: "50px auto",
//             width: "100%",
//             maxWidth: "1000px",
//           }}
//         >
//           {children}
//         </Content>
//       </Layout>
//     </MainDashboard>
//   );
// }
