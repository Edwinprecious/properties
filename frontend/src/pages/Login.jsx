import React, { useState } from "react";
import "./SignUp.css";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Changed: Use "email" instead of "identifier"
  const [form, setForm] = useState({
    email: "",     // ← Changed from "identifier"
    password: ""
  });

   const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)  // Now sends { email, password }
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Login successful");
        console.log("User:", data);
        
        // ✅ Save token and user info
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_role', data.role);
        
        // Redirect based on role
        if (data.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        alert(data.error || "Login failed");  // ← Changed from data.message
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
            {/* ✅ Changed: name="email" instead of "identifier" */}
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
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
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}