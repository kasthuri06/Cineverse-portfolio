import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load projects. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-8 text-lg">Loading projects...</div>;

  if (error)
    return <div className="p-8 text-lg text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Projects</h1>
      {projects.length === 0 ? (
        <div className="text-gray-600">No projects found.</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              to={`/projects/${project._id}`}
              key={project._id}
              className="block bg-white rounded-lg shadow hover:shadow-lg overflow-hidden outline-blue-300 outline-2 outline-offset-[-2px] focus:outline"
            >
              {project.posterUrl && (
                <img
                  src={project.posterUrl}
                  alt={project.title}
                  className="h-52 w-full object-cover"
                />
              )}
              <div className="p-4">
                <div className="font-semibold text-xl truncate">
                  {project.title}
                </div>
                <div className="text-blue-600 text-sm mb-2">
                  {project.category} &middot; {project.releaseYear}
                </div>
                <div className="text-gray-700 text-sm line-clamp-3">
                  {project.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
