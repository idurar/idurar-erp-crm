import * as React from "react";
import { render, screen, act } from "@testing-library/react";

import { Provider } from "react-redux";
import store from "@/redux/store";
import { CrudContextProvider } from "@/context/crud";

import ReadItem from "./index";
import FeedStoreMock from "@/test/mocksComponent/FeedStoreMock";

const data = {
  company: "IDURAR",
  managerSurname: "Lalami ",
  managerName: "Salah Eddine",
  email: "idurardz@gmail.com",
  phone: "05541 144 700",
};

const readColumns = [
  {
    title: "Company",
    dataIndex: "company",
  },
  {
    title: "Manager Surname",
    dataIndex: "managerSurname",
  },
  {
    title: "Manager Name",
    dataIndex: "managerName",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
  },
];

const config = { readColumns };
beforeAll(() => {
  delete window.matchMedia;
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
});
describe("Integration Testing : Read Component", () => {
  test("renders read component", () => {
    const { debug } = render(
      <Provider store={store}>
        <FeedStoreMock data={data} />
        <CrudContextProvider>
          <ReadItem config={config} />
        </CrudContextProvider>
      </Provider>
    );
    act(() => debug());
  });
});

// test('renders a number input with a label "Favorite Number"', () => {
//   render(<App />);
//   const input = screen.getByLabelText(/favorite number/i);
//   expect(input).toHaveAttribute("type", "number");
// });
