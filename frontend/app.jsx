import Signup from './components/Signup';
import Login from './components/Login';
// other imports

function App() {
  return (
    <BrowserRouter>
      {/* Maybe you have a layout / header wrapper */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* other secured routes */}
      </Routes>
    </BrowserRouter>
  );
}
