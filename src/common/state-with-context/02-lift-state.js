import React from 'react'

function Counter({count, onIncrementClick}) {
  return <button onClick={onIncrementClick}>{count}</button>
}

function CountDisplay({count}) {
  return <div>The current counter count is {count}</div>
}

function App() {
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + 1)
  return (
    <div>
      <CountDisplay count={count} />
      <Counter count={count} onIncrementClick={increment} />
    </div>
  )
}

export default App
