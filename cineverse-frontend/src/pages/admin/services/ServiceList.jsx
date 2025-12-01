import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/axios";

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function fetchServices() {
    setLoading(true);
    API.get("/services")
      .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load services");
        setLoading(false);
      });
  }
  useEffect(() => { fetchServices(); }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this service?")) return;
    try {
      await API.delete(`/services/${id}`);
      fetchServices();
    } catch {
      alert("Could not delete service.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-900">Services</h2>
        <button
          onClick={() => navigate("/admin/dashboard/services/new")}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900 shadow"
        >+ Add Service</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-2 border">Icon</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={4} className="p-3 text-center text-gray-400">No services.</td></tr>
              ) : (
                services.map(s => (
                  <tr key={s._id} className="even:bg-gray-50">
                    <td className="border p-2 text-center">
                      {s.iconUrl ? (
                        <img src={s.iconUrl} alt="icon" className="h-7 w-7 object-contain inline-block" />
                      ) : <span className="inline-block rounded bg-blue-50 px-3 py-1 font-semibold text-blue-700">S</span>}
                    </td>
                    <td className="border p-2">{s.title}</td>
                    <td className="border p-2 max-w-2xl truncate">{s.description}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => navigate(`/admin/dashboard/services/${s._id}/edit`)}
                        className="text-blue-700 font-bold hover:underline mr-2"
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-600 font-bold hover:underline"
                      >Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
