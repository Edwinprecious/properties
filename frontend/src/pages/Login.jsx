import React, { useState } from "react";
import "./SignUp.css";  // ✅ reuse same styles
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [form, setForm] = useState({
    identifier: "", // email OR phone
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Login successful");
        console.log("User:", data);
        // You can redirect with react-router here
        // navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-shell">
        <div className="form-card">
          <h2 className="title">
            Welcome <span>Back</span>!
          </h2>

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Email or Phone</label>
              <input
                type="text"
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                placeholder="Enter your email or phone number"
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="pwd-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn">Login</button>
          </form>

          <p className="alt">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
