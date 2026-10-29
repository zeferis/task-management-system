import { useState } from "react";
import { register } from "../services/authServices";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
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
        setErr(error.response?.data?.message || "Register failed");
      } else {
        setErr("Register failed");
      }
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand-mark" aria-hidden="true">
          ✓
        </div>
        <h1>Đăng ký</h1>
        <label htmlFor="username">Tên người dùng</label>
        <input
          id="username"
          autoComplete="nickname"
          type="text"
          placeholder="Nhập tên của bạn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          autoComplete="username"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          autoComplete="new-password"
          type="password"
          placeholder="Ít nhất 8 ký tự"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {err && (
          <p className="error-message" role="alert">
            {err}
          </p>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
        <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
      </form>
    </main>
  );
};
export default Register;
