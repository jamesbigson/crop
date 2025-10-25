import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Farmer");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const payload = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      state: state,
      password: password,
      usertype: role.toLowerCase().includes("farmer")
        ? "farmer"
        : "policy-maker",
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
            : `Server returned ${res.status}`;
        setError(serverMessage);
      } else {
        const msg =
          data && data.message ? data.message : "Registration successful";
        setSuccessMessage(msg);
        // clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setState("");
        setPassword("");
        setConfirmPassword("");
        setRole("Farmer");
        // after short delay, navigate to sign-in
        if (data && data.token) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify({ email })); // ✅ store user
  navigate("/Yeild"); // ✅ auto-login and go to Yeild
} else {
  setTimeout(() => navigate("/Sign"), 1000);
}

      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-container">
      <div className="sign-box">
        <h2>Sign Up</h2>

        <form onSubmit={handleSignUp} className="signup-form">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Farmer">Farmer</option>
            <option value="Policy Maker">Policy Maker</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
        {successMessage && (
          <p style={{ color: "green", marginTop: 12 }}>{successMessage}</p>
        )}
        <p className="signup-text">
          Already have an account? <Link to="/Sign">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
