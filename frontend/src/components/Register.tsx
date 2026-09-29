import { useState } from "react";
import { register } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading,setLoading]=useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(username, email, password);
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErr(error.response?.data?.message||"Register failed");
      }
      else{
        setErr("Register failed");
      }
    }
    finally{
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      {err && <p>{err}</p>}
      <button type="submit" disabled={loading}>{loading?"Registering":"Register"}</button>
    </form>
  );
};
export default Register;
