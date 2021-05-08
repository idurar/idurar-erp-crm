import React, { useEffect } from "react";

import Loading from "@/components/Loading";
import SearchBox from "@/components/SearchBox";
import { Dropdown, Menu, Table } from "antd";
import { Button, PageHeader, Form, Row, Col, Statistic, Tag } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { selectListItems, selectItemById } from "@/redux/crud/selectors";
import { useUiContext } from "@/context/ui";
import uniqueId from "@/utils/uniqueId";

function AddNewItem() {
  const { uiContextAction } = useUiContext();
  const { collapsedBox, panel } = uiContextAction;
  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      Add new Customer
    </Button>
  );
}

export default function CreateInvoice({ config }) {
  let { entity } = config;

  const dispatch = useDispatch();

  useEffect(() => {}, []);

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
      <SearchBox
        entity={"client"}
        keyRef={"client"}
        displayLabels={["company"]}
        searchFields={"company,managerSurname,managerName"}
      />
    </>
  );
}

// export default function CreateInvoice({ config, formElements }) {
//   let { entity } = config;
//   const dispatch = useDispatch();
//   const { isLoading, isSuccess } = useSelector(selectCreatedItem);
//   const { uiContextAction } = useUiContext();
//   const { panel, collapsedBox, readBox } = uiContextAction;
//   const [form] = Form.useForm();
//   const onSubmit = (fieldsValue) => {
//     let values = {};
//     if (fieldsValue) {
//       if (fieldsValue.birthday) {
//         values = {
//           ...fieldsValue,
//           birthday: fieldsValue["birthday"].format("DD/MM/YYYY"),
//         };
//       }
//       if (fieldsValue.date) {
//         values = {
//           ...fieldsValue,
//           birthday: fieldsValue["date"].format("DD/MM/YYYY"),
//         };
//       }
//     }

//     dispatch(crud.create(entity, values));
//   };

//   useEffect(() => {
//     if (isSuccess) {
//       readBox.open();
//       collapsedBox.open();
//       panel.open();
//       form.resetFields();
//       dispatch(crud.resetAction("create"));
//     }
//   }, [isSuccess]);

//   return (
//     <Loading isLoading={isLoading}>
//       <Form form={form} layout="vertical" onFinish={onSubmit}>
//         {formElements}
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </Form.Item>
//       </Form>
//     </Loading>
//   );
// }
