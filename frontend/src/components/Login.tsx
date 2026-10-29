import { useState } from "react";
import { login } from "../services/authServices";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
interface LoginProps {
  onLogin: (token: string) => void;
}
const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
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
      if (axios.isAxiosError(error)) {
        setErr(error.response?.data?.message || "Cannot login");
      } else {
        setErr("Cannot login");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand-mark" aria-hidden="true">
          ✓
        </div>
        <h1>Đăng nhập</h1>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="username"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          type="password"
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        {err && (
          <p className="error-message" role="alert">
            {err}
          </p>
        )}
        <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
      </form>
    </main>
  );
};
export default Login;
