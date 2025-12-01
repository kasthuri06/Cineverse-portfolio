import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    API.get("/projects?limit=3").then((res) => setProjects(res.data.slice(0, 3)));
    API.get("/services?limit=3").then((res) => setServices(res.data.slice(0, 3)));
    API.get("/about").then((res) => setAbout(res.data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-600 text-white py-16 px-4 rounded-lg shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-widest drop-shadow">Welcome to CineVerse</h1>
          <p className="text-lg md:text-2xl mb-6 font-light">Films, Ads, Shorts, Music Videos, and More</p>
          <Link
            to="/projects"
            className="mt-4 inline-block px-8 py-3 text-lg font-semibold bg-white text-blue-900 rounded shadow hover:bg-blue-50 hover:scale-105 transition"
          >
            Explore Our Projects
          </Link>
        </div>
      </section>
      {/* Projects Preview */}
      <section className="pt-16 pb-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Link to="/projects" className="text-blue-700 hover:underline">View all</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-3 text-gray-400">No projects yet.</div>
          ) : (
            projects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`} className="bg-white rounded-lg shadow group overflow-hidden hover:shadow-xl transition border border-gray-50 hover:border-blue-300">
                {project.posterUrl && (
                  <img src={project.posterUrl} alt={project.title} className="h-40 w-full object-cover group-hover:scale-105 transition" />
                )}
                <div className="p-4">
                  <div className="font-semibold text-lg">{project.title}</div>
                  <div className="text-blue-700 text-sm mb-1">{project.category}</div>
                  <div className="text-gray-600 truncate text-xs">{project.releaseYear}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
      {/* Services Preview */}
      <section className="pb-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">Our Services</h2>
          <Link to="/services" className="text-blue-700 hover:underline">See all</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-3 text-gray-400">Services coming soon.</div>
          ) : (
            services.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow p-5 flex flex-col items-center text-center hover:shadow-xl transition border border-gray-50 hover:border-blue-300">
                {service.iconUrl && <img src={service.iconUrl} alt="icon" className="h-12 w-12 object-contain mb-2" />}
                <div className="font-semibold text-lg mb-1">{service.title}</div>
                <div className="text-gray-600 text-sm line-clamp-2">{service.description}</div>
              </div>
            ))
          )}
        </div>
      </section>
      {/* About Preview */}
      <section className="pb-12 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">About CineVerse</h2>
        {about ? (
          <div>
            <div className="text-lg text-gray-700 mb-4 font-medium line-clamp-4">{about.mission}</div>
            <Link to="/about" className="inline-block mt-2 text-blue-700 font-semibold hover:underline">Learn More</Link>
          </div>
        ) : (
          <div className="text-gray-400">Loading...</div>
        )}
      </section>
    </div>
  );
}
