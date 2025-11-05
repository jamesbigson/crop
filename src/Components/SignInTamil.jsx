import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ஏற்கனவே உள்நுழைந்திருந்தால் நேரடியாக Yeild பக்கத்திற்கு செல்லும்
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/Yeild");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const serverMessage =
          data && (data.message || data.error)
            ? data.message || data.error
            : `சேவையகம் பிழை ${res.status}`;
        setError(serverMessage);
      } else {
        console.log("உள்நுழைவு வெற்றிகரமாக முடிந்தது", data);
        if (data) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify({ email }));
          navigate("/Yeild", { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || "இணையப் பிழை ஏற்பட்டுள்ளது");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-container">
      <div className="sign-box">
        <h2>உள்நுழைவு</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="மின்னஞ்சல் முகவரி"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="கடவுச்சொல்"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "உள்நுழைகிறது..." : "உள்நுழைக"}
          </button>
        </form>

        {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

        <p className="signup-text">
          கணக்கு இல்லையா?{" "}
          <Link to="/signup" style={{ color: "#007bff" }}>
            புதிய கணக்கை உருவாக்கவும்
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
