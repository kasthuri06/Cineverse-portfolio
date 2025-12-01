import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    if (!form.username || !form.password) {
      setError("All fields required.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (e) {
      setError(e?.response?.data?.msg || "Login failed. Check credentials and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-16 px-2">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-900">Admin Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 space-y-6"
        autoComplete="off"
      >
        <div>
          <label className="block text-blue-800 font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            required
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            disabled={submitting}
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-blue-800 font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            required
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            disabled={submitting}
            autoComplete="current-password"
          />
        </div>
        {error && (
          <div className="text-center text-red-600 text-sm font-semibold">{error}</div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-blue-700 text-white rounded font-bold text-lg hover:bg-blue-800 transition disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
