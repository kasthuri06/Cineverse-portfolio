import React, { useState } from "react";
import API from "../api/axios";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await API.post("/contact", form);
      setSuccess("Thank you for your message!");
      setForm({ name: "", email: "", message: "" });
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-2">
      <h1 className="text-3xl font-bold mb-5 text-blue-900 text-center">Contact Us</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8 space-y-5">
        <div>
          <label className="block text-blue-800 font-medium mb-1" htmlFor="name">Name</label>
          <input
            required
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block text-blue-800 font-medium mb-1" htmlFor="email">Email</label>
          <input
            required
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block text-blue-800 font-medium mb-1" htmlFor="message">Message</label>
          <textarea
            required
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 resize-none h-28 focus:outline-blue-400"
            disabled={submitting}
          />
        </div>
        {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
        {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 bg-blue-700 text-white rounded font-bold text-lg hover:bg-blue-800 transition disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
