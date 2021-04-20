import React from 'react'

// src/count/count-context.js
const CountContext = React.createContext()

function useCount() {
  const context = React.useContext(CountContext)
  if (!context) {
    throw new Error(`useCount must be used within a CountProvider`)
  }
  const [count, setCount] = context

  const increment = () => setCount(c => c + 1)
  return {
    count,
    setCount,
    increment,
  }
}

function CountProvider(props) {
  const [count, setCount] = React.useState(0)
  const value = React.useMemo(() => [count, setCount], [count])
  return <CountContext.Provider value={value} {...props} />
}

// export {CountProvider, useCount}

////////////////

// src/count/page.js

// import {CountProvider, useCount} from './count-context'

function Counter() {
  const {count, increment} = useCount()
  return <button onClick={increment}>{count}</button>
}

function CountDisplay() {
  const {count} = useCount()
  return <div>The current counter count is {count}</div>
}

function CountPage() {
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default CountPage
