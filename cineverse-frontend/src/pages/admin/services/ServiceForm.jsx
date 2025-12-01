import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/axios";

export default function ServiceForm({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: null,
    iconUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef();

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      API.get(`/services`).then(res => {
        const s = res.data.find(sv => sv._id === id);
        if (s) setForm(f => ({ ...f, ...s, iconUrl: s.iconUrl || "" }));
        setLoading(false);
      }).catch(() => {
        setError("Failed to load service.");
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm(f => ({ ...f, icon: files[0], iconUrl: URL.createObjectURL(files[0]) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!form.title || !form.description) {
      setError("All fields required");
      setLoading(false);
      return;
    }
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      if (form.icon) data.append("icon", form.icon);
      let res;
      if (isEdit && id) {
        res = await API.put(`/services/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        res = await API.post("/services", data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      navigate("/admin/dashboard/services");
    } catch {
      setError("Could not save service. Check details and try again.");
      setLoading(false);
    }
  }

  return (
    <form className="bg-white p-7 rounded-lg shadow max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-blue-900 mb-4">{isEdit ? "Edit" : "Add"} Service</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-blue-900">Title</label>
          <input className="w-full border rounded px-3 py-2" name="title" value={form.title} onChange={handleChange} disabled={loading} required />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium text-blue-900">Description</label>
          <textarea className="w-full border rounded px-3 py-2 min-h-[70px]" name="description" value={form.description} onChange={handleChange} disabled={loading} required />
        </div>
        <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4">
          <input ref={fileInput} type="file" name="icon" accept="image/*" onChange={handleChange} className="hidden" disabled={loading} />
          <button type="button" onClick={() => fileInput.current?.click()} className="px-4 py-2 bg-blue-50 text-blue-800 font-semibold rounded shadow" disabled={loading}>{form.iconUrl ? "Change Icon" : "Upload Icon"}</button>
          {form.iconUrl && <img src={form.iconUrl} alt="icon preview" className="h-16 rounded shadow" />}
        </div>
      </div>
      {error && <div className="text-red-600 text-center font-semibold mt-4">{error}</div>}
      <div className="flex gap-4 justify-end mt-5">
        <button type="button" onClick={() => navigate("/admin/dashboard/services")} className="px-5 py-2 font-semibold rounded bg-gray-100 hover:bg-gray-200">Cancel</button>
        <button type="submit" className="px-5 py-2 font-bold rounded bg-blue-700 text-white hover:bg-blue-900 disabled:opacity-50" disabled={loading}>{loading ? "Saving..." : isEdit ? "Save" : "Add"}</button>
      </div>
    </form>
  );
}
