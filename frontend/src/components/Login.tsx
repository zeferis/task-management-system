import { useState } from "react";
import { login } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import axios from "axios";
interface LoginProps {
  onLogin: (token: string) => void;
}
const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      setEmail("");
      setPassword("");
      onLogin(data.token);
      navigate("/");
    } catch (error) {
      if(axios.isAxiosError(error)){
        setErr(error.response?.data?.message||"Cannot login");
      }
      else{
        setErr("Cannot login");
      }
    }finally{
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        required
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        required
      />
      <button type="submit" disabled={loading}>{loading?"logining":"login"}</button>
      {err&&(<p>{err}</p>)}
    </form>
  );
};
export default Login;
