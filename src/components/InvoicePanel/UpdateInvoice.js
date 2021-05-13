import React, { useState, useEffect } from "react";
import { Form, Divider } from "antd";
import dayjs from "dayjs";
import { Button, PageHeader, Row, Statistic, Tag } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";

import { useUiContext } from "@/context/ui";
import uniqueId from "@/utils/uniqueId";
import { selectUpdatedItem } from "@/redux/crud/selectors";
import InvoiceForm from "./InvoiceForm";

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

export default function UpdateInvoice({ config }) {
  let { entity } = config;

  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [itemsTotal, setItemsTotal] = useState([]);

  const handelValuesChange = (changedValues, values) => {
    const items = values["items"];
    let subTotal = 0;

    if (items) {
      items.map((item) => {
        if (item) {
          if (item.quantity && item.price) {
            let total = item["quantity"] * item["price"];
            //sub total
            subTotal += total;
          }
        }
      });
      setSubTotal(subTotal);
    }
  };

  const onSubmit = (fieldsValue) => {
    if (fieldsValue) {
      if (fieldsValue.birthday) {
        fieldsValue = {
          ...fieldsValue,
          birthday: fieldsValue["birthday"].format("DD/MM/YYYY"),
        };
      }
      if (fieldsValue.date) {
        fieldsValue = {
          ...fieldsValue,
          birthday: fieldsValue["date"].format("DD/MM/YYYY"),
        };
      }
    }

    const id = current._id;
    console.log(fieldsValue);
    dispatch(crud.update(entity, id, fieldsValue));
  };

  useEffect(() => {
    console.log("current", current);

    if (current) {
      if (current.client) {
        const tmpValue = { ...current.client };
        setAutoCompleteValue(tmpValue);
        console.log("autoCompleteValue", autoCompleteValue);
        current.client = undefined;
        console.log("current client undefined", current);
      }
      if (current.date) {
        current.date = dayjs(current.date, "DD/MM/YYYY");
      }
      if (current.expiredDate) {
        current.expiredDate = dayjs(current.expiredDate, "DD/MM/YYYY");
      }
      if (!current.taxRate) {
        current.taxRate = 0;
      }

      const { subTotal } = current;

      form.setFieldsValue(current);
      setSubTotal(subTotal);
    }
    console.log(form.getFieldsValue());
  }, [current]);

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
      <Divider dashed />
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        onValuesChange={handelValuesChange}
      >
        <InvoiceForm
          subTotal={subTotal}
          autoCompleteUpdate={autoCompleteValue}
          itemsTotal={itemsTotal}
          current={current}
        />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

// import React, { useEffect } from "react";
// import dayjs from "dayjs";
// import { useDispatch, useSelector } from "react-redux";
// import { crud } from "@/redux/crud/actions";
// import { useUiContext } from "@/context/ui";
// import { selectUpdatedItem } from "@/redux/crud/selectors";

// import { Button, Form } from "antd";
// import Loading from "@/components/Loading";

// export default function Update({ config, formElements }) {
//   let { entity } = config;
//   const dispatch = useDispatch();
//   const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);

//   const { state, uiContextAction } = useUiContext();
//   const { panel, collapsedBox, readBox } = uiContextAction;

//   const [form] = Form.useForm();

//   const onSubmit = (fieldsValue) => {
//     if (fieldsValue) {
//       if (fieldsValue.birthday) {
//         fieldsValue = {
//           ...fieldsValue,
//           birthday: fieldsValue["birthday"].format("DD/MM/YYYY"),
//         };
//       }
//       if (fieldsValue.date) {
//         fieldsValue = {
//           ...fieldsValue,
//           birthday: fieldsValue["date"].format("DD/MM/YYYY"),
//         };
//       }
//     }

//     const id = current._id;
//     console.log(fieldsValue);
//     dispatch(crud.update(entity, id, fieldsValue));
//   };
//   useEffect(() => {
//     if (current) {
//       if (current.birthday) {
//         current.birthday = dayjs(current.birthday);
//       }
//       if (current.date) {
//         current.date = dayjs(current.date);
//       }
//       form.setFieldsValue(current);
//     }
//     // console.log(form.getFieldsValue());
//   }, [current]);

//   useEffect(() => {
//     if (isSuccess) {
//       readBox.open();
//       collapsedBox.open();
//       panel.open();
//       form.resetFields();
//       dispatch(crud.resetAction("update"));
//     }
//   }, [isSuccess]);

//   const { isReadBoxOpen } = state;

//   const show = isReadBoxOpen
//     ? { display: "none", opacity: 0 }
//     : { display: "block", opacity: 1 };
//   return (
//     <div style={show}>
//       <Loading isLoading={isLoading}>
//         <Form form={form} layout="vertical" onFinish={onSubmit}>
//           {formElements}
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//       </Loading>
//     </div>
//   );
// }
