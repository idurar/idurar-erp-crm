import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QueryList from './components/QueryList';
import QueryForm from './components/QueryForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QueryList />} />
        <Route path="/add" element={<QueryForm />} />
        <Route path="/edit/:id" element={<QueryForm />} />
      </Routes>
    </Router>
  );
}
export default App;
