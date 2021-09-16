import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
// import store from "@/redux/store";
import { CrudContextProvider } from "@/context/crud";
import { useDispatch, useSelector } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useCrudContext } from "@/context/crud";
import userEvent from "@testing-library/user-event";
import ReadItem from "./index";
import { renderHook } from "@testing-library/react-hooks";

const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);

let state = {
  crud: {
    current: {
      result: {
        company: "IDURAR",
        managerSurname: "Lalami ",
        managerName: "Salah Eddine",
        email: "idurardz@gmail.com",
        phone: "05541 144 700",
      },
    },
  },
};
const data = {
  company: "IDURAR",
  managerSurname: "Lalami ",
  managerName: "Salah Eddine",
  email: "idurardz@gmail.com",
  phone: "05541 144 700",
};
const store = mockStore(() => state);

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
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe("Test Read", () => {
  test("renders read component", () => {
    jest.useFakeTimers();
    const { debug } = render(
      <Provider store={store}>
        <CrudContextProvider>
          <ReadItem config={config} />
        </CrudContextProvider>
      </Provider>
    );
    act(() => debug());
  });
  // window.ononline = () => {
  //   expect(result.current.isOnline).toBe(true);
  // };
  // window.onoffline = () => {
  //   expect(result.current.isOnline).toBe(false);
  // };
});

// test('renders a number input with a label "Favorite Number"', () => {
//   render(<App />);
//   const input = screen.getByLabelText(/favorite number/i);
//   expect(input).toHaveAttribute("type", "number");
// });
