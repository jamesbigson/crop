import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("விவசாயி");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("கடவுச்சொற்கள் பொருந்தவில்லை!");
      return;
    }

    const payload = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      state: state,
      password: password,
      usertype: role.includes("விவசாயி") ? "farmer" : "policy-maker",
    };

    console.log(payload);

    setLoading(true);
    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const serverMessage =
          data && (data.message || data.error)
            ? data.message || data.error
            : `சேவையகத்தில் பிழை ஏற்பட்டுள்ளது (${res.status})`;
        setError(serverMessage);
      } else {
        const msg =
          data && data.message ? data.message : "பதிவு வெற்றிகரமாக முடிந்தது";
        setSuccessMessage(msg);

        // படிவத்தை காலியாக்கும்
        setFirstName("");
        setLastName("");
        setEmail("");
        setState("");
        setPassword("");
        setConfirmPassword("");
        setRole("விவசாயி");

        // வெற்றிக்குப் பிறகு தானாக உள்நுழைவு
        if (data && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify({ email }));
          navigate("/Yeild");
        } else {
          setTimeout(() => navigate("/Sign"), 1000);
        }
      }
    } catch (err) {
      setError(err.message || "இணைய இணைப்பு பிழை");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-container">
      <div className="sign-box">
        <h2>பதிவு</h2>

        <form onSubmit={handleSignUp} className="signup-form">
          <input
            type="text"
            placeholder="முதல் பெயர்"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="கடைசி பெயர்"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="மின்னஞ்சல் முகவரி"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="மாநிலம்"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="கடவுச்சொல்"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="கடவுச்சொல் உறுதிப்படுத்தவும்"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="விவசாயி">விவசாயி</option>
            <option value="கொள்கை அமைப்பாளர்">கொள்கை அமைப்பாளர்</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "பதிவாகிறது..." : "பதிவு செய்யவும்"}
          </button>
        </form>

        {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
        {successMessage && (
          <p style={{ color: "green", marginTop: 12 }}>{successMessage}</p>
        )}

        <p className="signup-text">
          ஏற்கனவே கணக்கு உள்ளதா?{" "}
          <Link to="/Sign" style={{ color: "#007bff" }}>
            உள்நுழைக
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
