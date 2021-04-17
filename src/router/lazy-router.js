import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './index.css';

const routes = [
  {
    path: '/framer-motion',
    name: 'Framer Motion',
    component: React.lazy(() => import('./demo/framer-motion')),
  },
  {
    path: '/async-hooks',
    name: 'Async React Hooks',
    component: React.lazy(() => import('./demo/async-hooks')),
  },
  {
    path: '/useEventListener',
    name: 'useEventListener',
    component: React.lazy(() => import('./demo/use-event-listener')),
  },
];

function App() {
  return (
    <Suspense fallback={null}>
      <Router>
        <div className='app'>
          <Route
            exact
            path='/'
            render={() => (
              <div>
                <h1>React Demos</h1>
                {routes.map((route, i) => (
                  <React.Fragment key={i}>
                    <div>
                      <Link to={route.path}>{route.name}</Link>
                    </div>
                    <br />
                  </React.Fragment>
                ))}
              </div>
            )}
          />

          {routes.map((route, i) => (
            <Route key={i} {...route} />
          ))}
        </div>
      </Router>
    </Suspense>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
