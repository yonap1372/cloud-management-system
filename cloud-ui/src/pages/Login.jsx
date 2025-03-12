import { useState, useEffect } from "react";
import { login } from "../services/auth"; // ✅ Cambiar `loginUser` por `login`
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login(email, password); // ✅ Usar `login` de `auth.js`
      
      if (result && result.token) {
        localStorage.setItem("token", result.token);
        
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        navigate("/dashboard");
      } else {
        setError("⚠️ Credenciales incorrectas o error en el servidor");
      }
    } catch (err) {
      setError(err.error || "Error de autenticación");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box-wrapper">
        <div className="login-box">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /><br />
            
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="remember-me">
              <input
                type="checkbox"
                id="remember-checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember-checkbox">Recuérdame</label>
            </div>
            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
