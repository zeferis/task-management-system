import { Routes, Route, Navigate } from "react-router-dom";
import { useCallback, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Tasks from "./pages/Tasks";
function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const handleLogout=useCallback(()=>{
    localStorage.removeItem('token');
    setToken(null);
  },[]);
  return (
    <Routes>
      <Route path="/" element={token ? <Tasks onLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login onLogin={setToken} />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
export default App;
