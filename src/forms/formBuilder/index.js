import React from "react";
import { Form } from "antd";
import FormElement from "./FormElement";
function App() {
  const components = [
    {
      component: "input",
      label: "First Name",
      required: true,
    },
    {
      component: "input",
      label: "Last Name",
      required: true,
    },
    {
      component: "input",
      label: "Email",
      required: true,
    },
    {
      component: "password",
      label: "Password",
      required: true,
    },
    {
      component: "checkbox",
      label: "Stay signed in",
      required: false,
    },
  ];
  return (
    <Form>
      {components.map((component) => (
        <FormElement {...component} />
      ))}
    </Form>
  );
}
export default App;
