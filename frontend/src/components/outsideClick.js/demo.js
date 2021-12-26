import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Dropdown from './Dropdown';
import './styles.css';

function App() {
  const [vegetagle, setVegetable] = useState(undefined);
  const [fruit, setFruit] = useState(undefined);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Dropdown
        placeholder="Select Vegetable"
        value={vegetagle}
        onChange={(v) => setVegetable(v)}
        options={['Tomato', 'Cucumber', 'Potato']}
      />
      <Dropdown
        placeholder="Select Fruit"
        value={fruit}
        onChange={(v) => setFruit(v)}
        options={['Apple', 'Banana', 'Orange', 'Mango']}
      />
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
