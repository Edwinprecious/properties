import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./SignUp.css";

export default function ResetPassword() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-shell">
        <div className="form-card">
          <h2 className="title">Reset <span>Password</span></h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <button type="submit" className="btn">Update Password</button>
          </form>
          {message && <p className="alt">{message}</p>}
        </div>
      </div>
    </div>
  );
}
