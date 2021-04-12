import React from "react";
import ReactDOM from "react-dom";

const FormContext = React.createContext();

function SomeForm() {
  const [state, setState] = React.useContext(FormContext);
  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <label htmlFor="dogNameInput">Dog Name</label>
        </div>
        <div>
          <input
            id="dogNameInput"
            name="dog"
            onChange={handleInputChange}
            value={state.dog || ""}
          />
        </div>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

// increase this number to make the speed difference more stark.
const dimensions = 250;
const data = Array.from({ length: dimensions }, () =>
  Array.from({ length: dimensions }, () => Math.random() * 100)
);

const initialRowsColumns = Math.floor(dimensions / 2);

function SomeScreen() {
  const [rows, setRows] = React.useState(initialRowsColumns);
  const [columns, setColumns] = React.useState(initialRowsColumns);
  return (
    <div>
      <p>
        <strong>
          Ok, so it's still pretty contrived... But pretend this is the rest of
          your app.
        </strong>
      </p>
      <div>
        <form>
          <div>
            <label>Rows to display: </label>
            <input
              value={rows}
              type="number"
              min={1}
              max={dimensions}
              onChange={(e) => setRows(e.target.value)}
            />
            {` (max: ${dimensions})`}
          </div>
          <div>
            <label>Columns to display: </label>
            <input
              value={columns}
              type="number"
              min={1}
              max={dimensions}
              onChange={(e) => setColumns(e.target.value)}
            />
            {` (max: ${dimensions})`}
          </div>
        </form>
      </div>
      <br />
      <div style={{ width: data.length * 40 }}>
        {data.slice(0, rows).map((row, i) => (
          <div key={i} style={{ display: "flex" }}>
            {row.slice(0, columns).map((cell, i) => (
              <div
                key={i}
                style={{
                  outline: `1px solid black`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 40,
                  height: 40,
                  color: cell > 50 ? "white" : "black",
                  backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
                }}
              >
                {Math.floor(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppBefore() {
  const [state, useState] = React.useState({});
  return (
    <FormContext.Provider value={[state, useState]}>
      <h1>My awesomely slow app</h1>
      <p>
        Type in the input. Because the children elements are new every render,
        React must re-rerender them, even if they don't need it.
      </p>
      <div>
        <SomeForm />
        <hr />
        <SomeScreen />
      </div>
    </FormContext.Provider>
  );
}

function AppAfter() {
  return (
    <AppWrapper>
      <SomeForm />
      <hr />
      <SomeScreen />
    </AppWrapper>
  );
}

function AppWrapper({ children }) {
  const [state, useState] = React.useState({});
  return (
    <FormContext.Provider value={[state, useState]}>
      <h1>My awesomely faster app</h1>
      <p>
        Type in the input. Because the children elements are consistent between
        renders, React is able to exit early and not re-rener those
        unnecessarily (so the data table doesn't get re-rendered which is why
        this one's faster).
      </p>
      <div>{children}</div>
    </FormContext.Provider>
  );
}

function App() {
  const [comp, setComp] = React.useState("slow");
  function handleChange(e) {
    setComp(e.target.value);
  }

  return (
    <>
      <div>
        <label>
          <input
            name="comp"
            checked={comp === "slow"}
            value="slow"
            type="radio"
            onChange={handleChange}
          />{" "}
          Slow
        </label>
        <label>
          <input
            name="comp"
            checked={comp === "fast"}
            value="fast"
            type="radio"
            onChange={handleChange}
          />{" "}
          Fast
        </label>
      </div>
      {comp === "slow" ? <AppBefore /> : <AppAfter />}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
