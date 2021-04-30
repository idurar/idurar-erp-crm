import React from "react";
import ReactDOM from "react-dom";
import {
  AccordionButton,
  AccordionItem,
  AccordionContents,
  TabButton,
  TabItem,
  TabItems,
  TabButtons,
} from "./lib";

// use-accordion.js
const actionTypes = { toggle_index: "toggle_index" };
function accordionReducer(openIndexes, action) {
  switch (action.type) {
    case actionTypes.toggle_index: {
      const closing = openIndexes.includes(action.index);
      return closing
        ? openIndexes.filter((i) => i !== action.index)
        : [...openIndexes, action.index];
    }
    default: {
      throw new Error(`Unhandled type in accordionReducer: ${action.type}`);
    }
  }
}

function useAccordion({ reducer = accordionReducer } = {}) {
  const [openIndexes, dispatch] = React.useReducer(reducer, [0]);
  const toggleIndex = (index) =>
    dispatch({ type: actionTypes.toggle_index, index });
  return { openIndexes, toggleIndex };
}

// export {useAccordion, accordionReducer, actionTypes}

// app.js
function preventCloseReducer(openIndexes, action) {
  if (action.type === actionTypes.toggle_index) {
    const closing = openIndexes.includes(action.index);
    const isLast = openIndexes.length < 2;
    if (closing && isLast) {
      return openIndexes;
    }
  }
}

function singleReducer(openIndexes, action) {
  if (action.type === actionTypes.toggle_index) {
    const closing = openIndexes.includes(action.index);
    if (!closing) {
      return [action.index];
    }
  }
}

function combineReducers(...reducers) {
  return (state, action) => {
    for (const reducer of reducers) {
      const result = reducer(state, action);
      if (result) return result;
    }
  };
}

function Accordion({ items, reducer = () => {}, ...props }) {
  const { openIndexes, toggleIndex } = useAccordion({
    reducer: combineReducers(reducer, accordionReducer),
  });
  return (
    <div>
      {items.map((item, index) => (
        <AccordionItem key={item.title} direction="vertical">
          <AccordionButton
            isOpen={openIndexes.includes(index)}
            onClick={() => toggleIndex(index)}
          >
            {item.title}{" "}
            <span>{openIndexes.includes(index) ? "👇" : "👈"}</span>
          </AccordionButton>
          <AccordionContents isOpen={openIndexes.includes(index)}>
            {item.contents}
          </AccordionContents>
        </AccordionItem>
      ))}
    </div>
  );
}

function useTabs({ reducer = () => {} } = {}) {
  return useAccordion({
    reducer: combineReducers(
      reducer,
      preventCloseReducer,
      singleReducer,
      accordionReducer
    ),
  });
}

function Tabs({ items }) {
  const { openIndexes, toggleIndex } = useTabs();
  return (
    <div>
      <TabItems>
        {items.map((item, index) => (
          <TabItem
            key={index}
            position="above"
            isOpen={openIndexes.includes(index)}
          >
            {items[index].contents}
          </TabItem>
        ))}
      </TabItems>
      <TabButtons>
        {items.map((item, index) => (
          <TabButton
            key={item.title}
            isOpen={openIndexes.includes(index)}
            onClick={() => toggleIndex(index)}
          >
            {item.title}
          </TabButton>
        ))}
      </TabButtons>
    </div>
  );
}

const items = [
  {
    title: "🐴",
    contents: (
      <div>
        Horses can sleep both lying down and standing up. Domestic horses have a
        lifespan of around 25 years. A 19th century horse named 'Old Billy' is
        said to have lived 62 years.
      </div>
    ),
  },
  {
    title: "🦏",
    contents: (
      <div>
        Rhino skin maybe thick but it can be quite sensitive to sunburns and
        insect bites which is why they like wallow so much – when the mud dries
        it acts as protection from the sunburns and insects.
      </div>
    ),
  },
  {
    title: "🦄",
    contents: (
      <div>
        If you’re looking to hunt a unicorn, but don’t know where to begin, try
        Lake Superior State University in Sault Ste. Marie, Michigan. Since
        1971, the university has issued permits to unicorn questers.
      </div>
    ),
  },
];

function App() {
  return (
    <div
      style={{
        maxWidth: 400,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 60,
      }}
    >
      <Accordion items={items} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
