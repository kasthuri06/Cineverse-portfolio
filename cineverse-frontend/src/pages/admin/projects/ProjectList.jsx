import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/axios";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function fetchProjects() {
    setLoading(true);
    API.get("/projects")
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load projects");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch {
      alert("Could not delete project.");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-900">Projects</h2>
        <button
          onClick={() => navigate("/admin/dashboard/projects/new")}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900 shadow"
        >
          + Add New Project
        </button>
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
                <th className="p-2 border">Poster</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Year</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan={5} className="p-3 text-center text-gray-400">No projects.</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p._id} className="even:bg-gray-50">
                    <td className="border p-2">
                      {p.posterUrl && <img alt="poster" src={p.posterUrl} className="h-10 rounded" />}
                    </td>
                    <td className="border p-2">{p.title}</td>
                    <td className="border p-2">{p.category}</td>
                    <td className="border p-2">{p.releaseYear}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => navigate(`/admin/dashboard/projects/${p._id}/edit`)}
                        className="text-blue-700 font-bold hover:underline mr-2"
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(p._id)}
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
