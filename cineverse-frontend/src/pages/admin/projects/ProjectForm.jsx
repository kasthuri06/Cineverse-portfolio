import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/axios";


import { useAdminAuth } from "../../../context/AdminAuthContext";

const CATEGORIES = ["Film", "Ad", "Short film", "Music video", "Other"];

export default function ProjectForm({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAdminAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Film",
    videoUrl: "",
    releaseYear: new Date().getFullYear(),
    poster: null, // file
    posterUrl: "", // preview
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef();

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      API.get(`/projects/${id}`)
        .then(res => {
          setForm(f => ({
            ...f,
            ...res.data,
            posterUrl: res.data.posterUrl || ""
          }));
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load project.");
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm(f => ({ ...f, poster: files[0], posterUrl: URL.createObjectURL(files[0]) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!form.title || !form.description || !form.releaseYear) {
      setError("Title, description, and release year required.");
      setLoading(false);
      return;
    }
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("videoUrl", form.videoUrl || "");
      data.append("releaseYear", form.releaseYear);
      if (form.poster) data.append("poster", form.poster);
      let res;
      if (isEdit && id) {
        res = await API.put(`/projects/${id}`, data, { headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${token}` } });

      } else {
        res = await API.post("/projects", data, { headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${token}` } });
      }
      navigate("/admin/dashboard/projects");
    } catch (e) {
      setError("Could not save project. Check details and try again.");
      setLoading(false);
    }
  }

  return (
    <form className="bg-white p-7 rounded-lg shadow max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-blue-900 mb-4">{isEdit ? "Edit" : "Add"} Project</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-blue-900">Title</label>
          <input className="w-full border rounded px-3 py-2" name="title" value={form.title} onChange={handleChange} disabled={loading} required />
        </div>
        <div>
          <label className="block font-medium text-blue-900">Category</label>
          <select className="w-full border rounded px-3 py-2" name="category" value={form.category} onChange={handleChange} disabled={loading}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium text-blue-900">Release Year</label>
          <input className="w-full border rounded px-3 py-2" name="releaseYear" type="number" value={form.releaseYear} onChange={handleChange} disabled={loading} required />
        </div>
        <div>
          <label className="block font-medium text-blue-900">Video URL (YouTube/Vimeo)</label>
          <input className="w-full border rounded px-3 py-2" name="videoUrl" value={form.videoUrl} onChange={handleChange} disabled={loading} />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium text-blue-900">Description</label>
          <textarea className="w-full border rounded px-3 py-2 min-h-[80px]" name="description" value={form.description} onChange={handleChange} disabled={loading} required />
        </div>
        <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4">
          <input ref={fileInput} type="file" name="poster" accept="image/*" onChange={handleChange} className="hidden" disabled={loading} />
          <button
            type="button"
            className="px-4 py-2 bg-blue-50 text-blue-800 font-semibold rounded shadow focus:outline-blue-200"
            onClick={() => fileInput.current?.click()}
            disabled={loading}
          >
            {form.posterUrl ? "Change Poster" : "Upload Poster"}
          </button>
          {form.posterUrl && <img src={form.posterUrl} alt="poster preview" className="h-20 rounded shadow" />}
        </div>
      </div>
      {error && <div className="text-red-600 text-center font-semibold mt-4">{error}</div>}
      <div className="flex gap-4 justify-end mt-7">
        <button type="button" onClick={() => navigate("/admin/dashboard/projects")} className="px-5 py-2 font-semibold rounded bg-gray-100 hover:bg-gray-200">Cancel</button>
        <button type="submit" className="px-5 py-2 font-bold rounded bg-blue-700 text-white hover:bg-blue-900 disabled:opacity-50" disabled={loading}>{loading ? "Saving..." : isEdit ? "Save" : "Add"}</button>
      </div>
    </form>
  );
}
